import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { validate, DEFAULT_CONTENT, serialize, deserialize, assertIntegrity } from "./content-schema.js";

const STORAGE_KEY = "restauhub.cms.v1";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ─── Context ─────────────────────────────────────────────────────────────────

const ContentContext = createContext(null);

// ─── Deep-set utility ────────────────────────────────────────────────────────

/**
 * Deep-set a value at a dot-notation or array path on a cloned object.
 * e.g. deepSet(obj, "branding.restaurantName", "New Name")
 * e.g. deepSet(obj, "menu.items[0].name", "Tagine")
 *
 * @param {object} obj - source object (will NOT be mutated)
 * @param {string|string[]} path - dot-notation path or array of keys
 * @param {*} value - value to set
 * @returns {object} - new object with value set
 */
function deepSet(obj, path, value) {
  const clone = structuredClone(obj);
  const keys = typeof path === "string" ? parsePath(path) : path;
  let current = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] === undefined || current[key] === null) {
      // Determine if next key is numeric index
      current[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
  return clone;
}

/**
 * Parse a dot-notation path like "menu.items[0].name" into ["menu", "items", "0", "name"]
 */
function parsePath(path) {
  const parts = [];
  const segments = path.split(".");
  for (const segment of segments) {
    // Handle array notation: items[0] → "items", "0"
    const match = segment.match(/^([^[]+)(?:\[(\d+)\])?$/);
    if (match) {
      parts.push(match[1]);
      if (match[2] !== undefined) {
        parts.push(match[2]);
      }
    } else {
      parts.push(segment);
    }
  }
  return parts;
}

// ─── Helper to load from localStorage ────────────────────────────────────────

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const result = validate(parsed);
      if (result.valid) return result.value;
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState("loaded");
  const initializedRef = useRef(false);

  // Load content on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    let cancelled = false;

    async function init() {
      // Try API first
      try {
        const res = await fetch(`${API_BASE}/api/content`, {
          method: "GET",
          headers: { "Accept": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          const result = validate(data);
          if (result.valid) {
            if (!cancelled) {
              setContent(result.value);
              setStatus("loaded");
            }
            return;
          }
        }
      } catch {
        // network error — fall through
      }

      // Fallback: localStorage
      const local = loadFromLocalStorage();
      if (local) {
        if (!cancelled) {
          setContent(local);
          setStatus("loaded");
        }
        return;
      }

      // Final fallback: DEFAULT_CONTENT
      if (!cancelled) {
        setContent(structuredClone(DEFAULT_CONTENT));
        setStatus("loaded");
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  // ─── updateContent ───────────────────────────────────────────────────────

  const updateContent = useCallback((path, value) => {
    setContent((prev) => {
      if (!prev) return prev;
      const updated = deepSet(prev, path, value);
      return updated;
    });
    setStatus("unsaved");
  }, []);

  // ─── saveContent ─────────────────────────────────────────────────────────

  const saveContent = useCallback(async () => {
    setStatus("saving");

    const currentContent = contentRef.current;
    if (!currentContent) {
      setStatus("loaded");
      return;
    }

    // Run integrity checks before persisting
    const integrity = assertIntegrity(currentContent);
    if (!integrity.ok) {
      console.warn("[Content_Store] Integrity check failed before save:", integrity.errors);
      // Still allow save (data may be in-progress), but log for debugging
    }

    const json = serialize(currentContent);

    try {
      const res = await fetch(`${API_BASE}/api/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: json,
      });

      if (res.ok) {
        // Persist to localStorage as well
        localStorage.setItem(STORAGE_KEY, json);
        setStatus("saved");
      } else {
        // Non-2xx: persist to localStorage, mark offline
        localStorage.setItem(STORAGE_KEY, json);
        setStatus("offline");
      }
    } catch {
      // Network error: persist to localStorage, mark offline
      localStorage.setItem(STORAGE_KEY, json);
      setStatus("offline");
    }
  }, []);

  // Keep a ref to current content so saveContent always has latest
  const contentRef = useRef(content);
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // ─── Context value ───────────────────────────────────────────────────────

  const contextValue = {
    content,
    updateContent,
    saveContent,
    status,
  };

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Access CMS content and operations.
 * @returns {{ content: object|null, updateContent: (path: string, value: any) => void, saveContent: () => Promise<void>, status: "loaded"|"saving"|"saved"|"unsaved"|"offline" }}
 */
export function useContent() {
  const ctx = useContext(ContentContext);
  if (ctx === null) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return ctx;
}
