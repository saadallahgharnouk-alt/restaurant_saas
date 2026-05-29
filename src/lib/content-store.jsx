import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { validate, DEFAULT_CONTENT, serialize, assertIntegrity } from "./content-schema.js";

const STORAGE_KEY = "restauhub.cms.v1";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_TIMEOUT_MS = 2500;

// ─── Context ─────────────────────────────────────────────────────────────────

const ContentContext = createContext(null);

// ─── Deep-set utility ────────────────────────────────────────────────────────

function deepSet(obj, path, value) {
  const clone = structuredClone(obj);
  const keys = typeof path === "string" ? parsePath(path) : path;
  let current = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] === undefined || current[key] === null) {
      current[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
  return clone;
}

function parsePath(path) {
  const parts = [];
  const segments = path.split(".");
  for (const segment of segments) {
    const match = segment.match(/^([^[]+)(?:\[(\d+)\])?$/);
    if (match) {
      parts.push(match[1]);
      if (match[2] !== undefined) parts.push(match[2]);
    } else {
      parts.push(segment);
    }
  }
  return parts;
}

// ─── Initial content (sync) ──────────────────────────────────────────────────

/**
 * Read initial content **synchronously** so the provider never starts in a
 * null state. This kills the entire class of "infinite loading spinner"
 * issues in editors, and also avoids problems with React StrictMode
 * double-invoking effects in development.
 *
 * Priority: localStorage → DEFAULT_CONTENT.
 * The optional API fetch happens later as an overlay.
 */
function loadInitialContent() {
  try {
    const raw = typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const result = validate(parsed);
      if (result.valid) return result.value;
    }
  } catch {
    /* ignore */
  }
  return structuredClone(DEFAULT_CONTENT);
}

/** Async fetch the API with a hard timeout so we never hang on a dead host. */
async function fetchApiContent() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE}/api/content`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    const result = validate(data);
    return result.valid ? result.value : null;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function ContentProvider({ children }) {
  // 1. Initialise synchronously — content is NEVER null after this.
  const [content, setContent] = useState(loadInitialContent);
  const [status, setStatus] = useState("loaded");
  const apiAttemptedRef = useRef(false);

  // 2. Try to overlay with API content (best-effort, non-blocking).
  useEffect(() => {
    if (apiAttemptedRef.current) return;
    apiAttemptedRef.current = true;

    let cancelled = false;
    fetchApiContent().then((apiContent) => {
      if (cancelled || !apiContent) return;
      // Only overlay if API content is materially different from what we have
      try {
        const localJson = serialize(content);
        const apiJson = serialize(apiContent);
        if (localJson !== apiJson) {
          setContent(apiContent);
        }
      } catch {
        setContent(apiContent);
      }
    });

    return () => { cancelled = true; };
    // We intentionally don't include `content` in deps — we want to fetch
    // the API exactly once at mount to overlay the initial sync content.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── updateContent ────────────────────────────────────────────────────────

  const updateContent = useCallback((path, value) => {
    setContent((prev) => (prev ? deepSet(prev, path, value) : prev));
    setStatus("unsaved");
  }, []);

  /** Replace content wholesale — used by editors that want full control. */
  const replaceContent = useCallback((next) => {
    setContent(next);
    setStatus("unsaved");
  }, []);

  // ─── saveContent ──────────────────────────────────────────────────────────

  // Keep a ref to current content so saveContent always has latest
  const contentRef = useRef(content);
  useEffect(() => { contentRef.current = content; }, [content]);

  const saveContent = useCallback(async () => {
    const currentContent = contentRef.current;
    if (!currentContent) return;

    setStatus("saving");

    const integrity = assertIntegrity(currentContent);
    if (!integrity.ok) {
      console.warn("[Content_Store] Integrity check failed before save:", integrity.errors);
    }

    const json = serialize(currentContent);

    // Always persist locally first — this is the user's source of truth.
    try { localStorage.setItem(STORAGE_KEY, json); } catch { /* quota? */ }

    // Best-effort sync to backend.
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
      const res = await fetch(`${API_BASE}/api/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: json,
        signal: controller.signal,
      });
      clearTimeout(timer);
      setStatus(res.ok ? "saved" : "offline");
    } catch {
      setStatus("offline");
    }
  }, []);

  // ─── Context value ────────────────────────────────────────────────────────

  const contextValue = {
    content,
    updateContent,
    replaceContent,
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

export function useContent() {
  const ctx = useContext(ContentContext);
  if (ctx === null) throw new Error("useContent must be used within a ContentProvider");
  return ctx;
}
