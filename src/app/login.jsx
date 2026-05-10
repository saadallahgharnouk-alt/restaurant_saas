import React, { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { Reveal } from '../components/primitives';
import { useContent } from '../store/content';

/* ──────────────────────────────────────────────────────────────
   /login — demo manager login.
   Username & password: admin / admin   (see VITE_ADMIN_*).
   ────────────────────────────────────────────────────────────── */

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const content = useContent();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [busy, setBusy]         = useState(false);

  if (user) {
    const params = new URLSearchParams(loc.search);
    const next = params.get('next') || '/admin';
    return <Navigate to={next} replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await login(username, password);
    setBusy(false);
    if (res.ok) {
      const params = new URLSearchParams(loc.search);
      nav(params.get('next') || '/admin');
    } else {
      setError(res.error || 'Login failed.');
    }
  };

  return (
    <div className="login-wrap">
      {/* Left — editorial brand panel */}
      <aside className="login-aside">
        <div style={{ position: 'relative' }}>
          <span
            className="eyebrow"
            style={{ color: 'rgba(245,239,227,0.7)', marginBottom: 14 }}
          >
            Manager panel
          </span>
          <h1 className="glyph">
            {content.brand.name}.<br />
            The <em>kitchen&rsquo;s office</em>.
          </h1>
          <p
            style={{
              color: 'rgba(245,239,227,0.7)',
              marginTop: 18,
              maxWidth: 44,
              fontSize: 15,
            }}
          >
            Sign in to edit the menu, refresh the homepage, and read tonight&rsquo;s numbers.
          </p>
        </div>

        <div className="credits">
          Built with care · {new Date().getFullYear()}
        </div>
      </aside>

      {/* Right — form */}
      <div className="login-panel">
        <Reveal>
          <form className="login-form" onSubmit={onSubmit} noValidate>
            <span className="eyebrow">Sign in</span>
            <h1>
              Welcome <em>back</em>.
            </h1>

            <div className="note">
              <strong>Demo credentials:</strong>{' '}
              <code
                style={{
                  fontFamily: 'var(--font-mono)',
                  background: 'rgba(232,111,78,0.12)',
                  padding: '1px 6px',
                  borderRadius: 4,
                }}
              >
                admin / admin
              </code>
              &nbsp;— replace with real auth before production.
            </div>

            <div className="field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                className="input"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="input"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button
              type="submit"
              className="btn btn-ember btn-lg btn-arrow"
              style={{ justifyContent: 'center', marginTop: 8 }}
              disabled={busy}
            >
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
