import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────

const SESSION_KEY = "restauhub.session.v1";
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

// ─── SHA-256 helper (Web Crypto) ─────────────────────────────────────────────

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Default SHA-256 of "admin"
const DEFAULT_ADMIN_HASH =
  "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918";

// ─── Auth_Config loader ──────────────────────────────────────────────────────

function loadAuthConfig() {
  try {
    const raw = import.meta.env.VITE_ADMIN_CREDENTIALS;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.username && parsed.passwordHash) {
        return { username: parsed.username, passwordHash: parsed.passwordHash };
      }
    }
  } catch {
    // Invalid JSON — fall through to default
  }
  return { username: "admin", passwordHash: DEFAULT_ADMIN_HASH };
}

const AUTH_CONFIG = loadAuthConfig();

// ─── Session helpers ─────────────────────────────────────────────────────────

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (
      session &&
      typeof session.username === "string" &&
      typeof session.createdAt === "number" &&
      typeof session.expiresAt === "number" &&
      Date.now() < session.expiresAt
    ) {
      return session;
    }
    // Expired or malformed — remove
    localStorage.removeItem(SESSION_KEY);
  } catch {
    localStorage.removeItem(SESSION_KEY);
  }
  return null;
}

function writeSession(username) {
  const now = Date.now();
  const session = {
    username,
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the app, provides auth state + actions.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readSession());

  // Re-check session validity on focus (handles expiry while tab is backgrounded)
  useEffect(() => {
    const check = () => {
      const current = readSession();
      if (!current && session) {
        setSession(null);
      }
    };
    window.addEventListener("focus", check);
    return () => window.removeEventListener("focus", check);
  }, [session]);

  const signIn = useCallback(async (username, password) => {
    const hash = await sha256(password);
    if (username === AUTH_CONFIG.username && hash === AUTH_CONFIG.passwordHash) {
      const newSession = writeSession(username);
      setSession(newSession);
      return { success: true };
    }
    return { success: false, error: "Invalid username or password." };
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const isAuthenticated = session !== null;

  return (
    <AuthContext.Provider value={{ session, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth hook — access auth state and actions.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

// ─── Auth Gate ───────────────────────────────────────────────────────────────

/**
 * AuthGate — wraps admin routes. Shows LoginScreen when unauthenticated.
 * Preserves the originally requested path so we can redirect after login.
 */
export function AuthGate({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <>{children}</>;
}

// ─── Login Screen ────────────────────────────────────────────────────────────

function LoginScreen() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn(username, password);

    if (!result.success) {
      setError(result.error);
      setPassword("");
      setLoading(false);
    }
    // On success, session state updates trigger re-render of AuthGate,
    // which will show the children (admin content). No manual redirect needed
    // since we're using component-level gating.
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--bg, #0A0A0C)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          background: "var(--surface, #15151A)",
          border: "1px solid var(--rule, rgba(255,255,255,0.07))",
          borderRadius: 20,
          padding: "40px 32px",
          boxShadow: "0 16px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "var(--fg, #F4F1EA)",
            }}
          >
            restau<em style={{ color: "var(--ember, #FF6B1F)", fontStyle: "italic" }}>hub</em>
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--fg-faint, #6B686A)",
              marginTop: 6,
            }}
          >
            Manager Login
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="auth-username"
              style={{
                display: "block",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--fg-faint, #6B686A)",
                marginBottom: 6,
              }}
            >
              Username
            </label>
            <input
              id="auth-username"
              type="text"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              htmlFor="auth-password"
              style={{
                display: "block",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--fg-faint, #6B686A)",
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div
              role="alert"
              style={{
                marginBottom: 16,
                padding: "10px 14px",
                borderRadius: 10,
                background: "rgba(255,107,31,0.1)",
                border: "1px solid rgba(255,107,31,0.3)",
                color: "var(--ember, #FF6B1F)",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-ember"
            disabled={loading}
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "14px 24px",
              fontSize: 15,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div
          style={{
            marginTop: 20,
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.1em",
            color: "var(--fg-muted, #45434A)",
          }}
        >
          Default: admin / admin
        </div>
      </div>
    </div>
  );
}
