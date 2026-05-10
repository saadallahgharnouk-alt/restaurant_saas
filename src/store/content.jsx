import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { DEFAULT_CONTENT, CONTENT_VERSION } from './defaults';

/* ──────────────────────────────────────────────────────────────
   Content store
   --------------------------------------------------------------
   All editable site/menu content lives here. One object, one
   context, two hooks:

     useContent()          → read the live content
     useContentActions()   → mutators + image upload helper

   Persistence: localStorage (demo mode). Swapping to a real
   backend later means replacing the load/save methods — no
   page component needs to change.
   ────────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'restauhub:content:v1';
const ContentContext = createContext(null);

/* deep clone that works for our JSON-shaped content */
const clone = (o) => JSON.parse(JSON.stringify(o));

/* URL-safe slug for category ids */
const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || `cat-${Date.now()}`;

/* merge persisted state on top of defaults — keeps forward compat
   if we add new fields to DEFAULT_CONTENT later */
function hydrate(saved) {
  if (!saved || saved.__v !== CONTENT_VERSION) return clone(DEFAULT_CONTENT);
  const base = clone(DEFAULT_CONTENT);
  // Deep-merge, with `saved` winning on conflicts
  const merge = (a, b) => {
    if (Array.isArray(b)) return clone(b);
    if (b && typeof b === 'object') {
      const out = { ...a };
      for (const k of Object.keys(b)) out[k] = merge(a?.[k], b[k]);
      return out;
    }
    return b === undefined ? a : b;
  };
  return merge(base, saved.content || {});
}

function persist(content) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ __v: CONTENT_VERSION, content })
    );
  } catch (e) {
    // Storage may be full (data-URL images are heavy). Tell the UI.
    console.warn('Content persist failed:', e);
    throw e;
  }
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => {
    if (typeof window === 'undefined') return clone(DEFAULT_CONTENT);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return hydrate(raw ? JSON.parse(raw) : null);
    } catch {
      return clone(DEFAULT_CONTENT);
    }
  });

  // Persist on every change (debounced; ~1 change every 200 ms max).
  useEffect(() => {
    const id = setTimeout(() => {
      try { persist(content); } catch { /* UI already notified */ }
    }, 200);
    return () => clearTimeout(id);
  }, [content]);

  /* ──────────── actions ──────────── */

  const updatePath = useCallback((path, value) => {
    setContent((prev) => {
      const next = clone(prev);
      const parts = path.split('.');
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) {
        const k = parts[i];
        if (cur[k] === undefined || cur[k] === null) cur[k] = {};
        cur = cur[k];
      }
      cur[parts[parts.length - 1]] = value;
      return next;
    });
  }, []);

  const addMenuItem = useCallback((item) => {
    setContent((prev) => {
      const next = clone(prev);
      next.menu.items = next.menu.items || [];
      next.menu.items.push({
        id: item.id || `item-${Date.now()}`,
        category: 'starters',
        name: 'New dish',
        price: 0,
        description: '',
        ingredients: [],
        extras: [],
        available: true,
        image: '',
        ...item,
      });
      return next;
    });
  }, []);

  const updateMenuItem = useCallback((id, patch) => {
    setContent((prev) => {
      const next = clone(prev);
      const i = next.menu.items.findIndex((x) => x.id === id);
      if (i >= 0) next.menu.items[i] = { ...next.menu.items[i], ...patch };
      return next;
    });
  }, []);

  const deleteMenuItem = useCallback((id) => {
    setContent((prev) => {
      const next = clone(prev);
      next.menu.items = next.menu.items.filter((x) => x.id !== id);
      return next;
    });
  }, []);

  /* ── Categories ──────────────────────────── */

  const addCategory = useCallback((name) => {
    const trimmed = (name || '').trim();
    if (!trimmed) return;
    setContent((prev) => {
      const next = clone(prev);
      const slug = slugify(trimmed);
      const existing = (next.menu.categories || []).map((c) => c.id);
      // If the slug already exists, append a numeric suffix.
      let id = slug, n = 2;
      while (existing.includes(id)) id = `${slug}-${n++}`;
      const maxOrder = (next.menu.categories || [])
        .reduce((m, c) => Math.max(m, c.order || 0), 0);
      next.menu.categories = [
        ...(next.menu.categories || []),
        { id, name: trimmed, order: maxOrder + 1 },
      ];
      return next;
    });
  }, []);

  const updateCategory = useCallback((id, patch) => {
    setContent((prev) => {
      const next = clone(prev);
      next.menu.categories = (next.menu.categories || []).map((c) =>
        c.id === id ? { ...c, ...patch } : c
      );
      return next;
    });
  }, []);

  const moveCategory = useCallback((id, delta) => {
    setContent((prev) => {
      const next = clone(prev);
      const list = (next.menu.categories || [])
        .slice()
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      const idx = list.findIndex((c) => c.id === id);
      const target = idx + delta;
      if (idx < 0 || target < 0 || target >= list.length) return prev;
      // Swap orders
      [list[idx], list[target]] = [list[target], list[idx]];
      list.forEach((c, i) => (c.order = i + 1));
      next.menu.categories = list;
      return next;
    });
  }, []);

  const deleteCategory = useCallback((id, fallbackId = null) => {
    setContent((prev) => {
      const next = clone(prev);
      const remaining = (next.menu.categories || []).filter((c) => c.id !== id);
      if (remaining.length === 0) return prev; // never leave zero categories
      const moveTo =
        fallbackId && remaining.some((c) => c.id === fallbackId)
          ? fallbackId
          : remaining[0].id;
      next.menu.categories = remaining.map((c, i) => ({ ...c, order: i + 1 }));
      next.menu.items = (next.menu.items || []).map((it) =>
        it.category === id ? { ...it, category: moveTo } : it
      );
      return next;
    });
  }, []);

  const addGalleryImage = useCallback((dataUrl) => {
    setContent((prev) => {
      const next = clone(prev);
      next.gallery = [dataUrl, ...(next.gallery || [])].slice(0, 12);
      return next;
    });
  }, []);

  const removeGalleryImage = useCallback((idx) => {
    setContent((prev) => {
      const next = clone(prev);
      next.gallery = (next.gallery || []).filter((_, i) => i !== idx);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setContent(clone(DEFAULT_CONTENT));
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  const actions = useMemo(
    () => ({
      updatePath,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      addCategory,
      updateCategory,
      moveCategory,
      deleteCategory,
      addGalleryImage,
      removeGalleryImage,
      resetAll,
    }),
    [
      updatePath,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      addCategory,
      updateCategory,
      moveCategory,
      deleteCategory,
      addGalleryImage,
      removeGalleryImage,
      resetAll,
    ]
  );

  const value = useMemo(() => ({ content, actions }), [content, actions]);

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used inside ContentProvider');
  return ctx.content;
}

export function useContentActions() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContentActions must be used inside ContentProvider');
  return ctx.actions;
}
