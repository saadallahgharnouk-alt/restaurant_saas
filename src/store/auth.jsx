import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/* ──────────────────────────────────────────────────────────────
   Demo auth
   --------------------------------------------------------------
   Single-password "manager" login for the admin panel. Good
   enough for a local demo / pilot; swap login() for a real API
   call when you have a backend.

   Default password: "demo" (override with VITE_ADMIN_PASSWORD)
   ────────────────────────────────────────────────────────────── */

/* Default demo credentials are `admin` / `admin`.
   Override in production with VITE_ADMIN_USER / VITE_ADMIN_PASSWORD. */
const env =
  (typeof import.meta !== 'undefined' && import.meta.env) || {};
const ADMIN_USER = env.VITE_ADMIN_USER || 'admin';
const ADMIN_PASS = env.VITE_ADMIN_PASSWORD || 'admin';

const STORAGE_KEY = 'restauhub:auth:v1';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore storage errors */ }
  }, [user]);

  const login = useCallback(async (username, password) => {
    // Tiny faux-latency so the spinner actually registers.
    await new Promise((r) => setTimeout(r, 350));
    const u = String(username || '').trim().toLowerCase();
    const p = String(password || '');
    if (u === ADMIN_USER.toLowerCase() && p === ADMIN_PASS) {
      setUser({ role: 'manager', name: ADMIN_USER, at: Date.now() });
      return { ok: true };
    }
    return { ok: false, error: 'Incorrect username or password.' };
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

/**
 * <RequireAuth> — wraps admin routes. Redirects to /login and
 * remembers where the user was headed via ?next=.
 */
export function RequireAuth({ children }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) {
    const next = encodeURIComponent(loc.pathname + loc.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return children;
}
