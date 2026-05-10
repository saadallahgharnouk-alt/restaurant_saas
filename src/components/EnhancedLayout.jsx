import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GrainOverlay, MagneticButton } from './primitives';
import { useAuth } from '../lib/auth';

/* ───────────────────────────────────────────────────────────────
   EnhancedLayout — the admin chrome (top nav + footer + grain).
   Anthropic/Linear inspired: cream paper, sticky nav that subtly
   densifies on scroll, pill links, magnetic CTA, mobile drawer.
   ─────────────────────────────────────────────────────────────── */

const NAV = [
  { to: '/',          label: 'Home'    },
  { to: '/menu',      label: 'Menu'    },
  { to: '/dashboard', label: 'Manager' },
];

function isActive(pathname, to) {
  if (to === '/') return pathname === '/';
  return pathname === to || pathname.startsWith(to + '/');
}

export default function EnhancedLayout({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu when route changes.
  useEffect(() => { setOpen(false); }, [pathname]);

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <div className="app">
      <GrainOverlay />

      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-brand" aria-label="RestauHub home">
          <img src="/logo-mark.svg" alt="" width="36" height="36" />
          <span className="nav-brand-text">
            <span className="nav-brand-name">
              restau<em>hub</em>
            </span>
            <span className="nav-brand-sub">Modern Restaurant OS</span>
          </span>
        </Link>

        <div className={`nav-links ${open ? 'open' : ''}`}>
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`nav-link ${isActive(pathname, n.to) ? 'active' : ''}`}
            >
              {n.label}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <span className="status-dot" aria-label="System status: live">Live</span>
          {isAuthenticated ? (
            <>
              <MagneticButton
                as={Link}
                to="/admin/content"
                className="btn btn-ghost btn-sm"
                strength={8}
              >
                Edit Content
              </MagneticButton>
              <button
                type="button"
                onClick={handleSignOut}
                className="btn btn-sm"
                style={{ background: 'var(--surface-2, #1C1C22)', borderColor: 'var(--rule-strong, rgba(255,255,255,0.15))' }}
              >
                Sign out
              </button>
            </>
          ) : (
            <MagneticButton
              as={Link}
              to="/dashboard"
              className="btn btn-ember btn-sm btn-arrow"
              strength={8}
            >
              Manager
            </MagneticButton>
          )}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            className="nav-burger"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>

      <footer className="site-footer">
        <span>
          <span className="brandline">restau<em>hub</em></span>
          &nbsp;·&nbsp; built for calm kitchens &nbsp;·&nbsp; © {new Date().getFullYear()}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontSize: 11,
          }}
        >
          React &middot; Vite &middot; Node
        </span>
      </footer>
    </div>
  );
}
