import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GrainOverlay, MagneticButton } from './primitives';
import { useAuth } from '../store/auth';
import { useContent } from '../store/content';

/* ──────────────────────────────────────────────────────────────
   Site chrome — cream sticky nav + footer. Three primary routes:
   Home, Menu, and the manager login / panel.
   ────────────────────────────────────────────────────────────── */

const PUBLIC_NAV = [
  { to: '/',      label: 'Home' },
  { to: '/menu',  label: 'Menu' },
];

function isActive(pathname, to) {
  if (to === '/') return pathname === '/';
  return pathname === to || pathname.startsWith(to + '/');
}

export default function EnhancedLayout({ children }) {
  const { pathname } = useLocation();
  const { user }     = useAuth();
  const content      = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const brand = content?.brand?.name || 'RestauHub';

  return (
    <div className="app">
      <GrainOverlay />

      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-brand" aria-label={`${brand} home`}>
          <img src="/logo-mark.svg" alt="" width="36" height="36" />
          <span className="nav-brand-text">
            <span className="nav-brand-name">
              {brand.split(' ')[0]}{' '}
              <em>{brand.split(' ').slice(1).join(' ') || content?.brand?.location_city || ''}</em>
            </span>
            <span className="nav-brand-sub">
              {content?.brand?.location_city || 'Restaurant'}
            </span>
          </span>
        </Link>

        <div className={`nav-links ${open ? 'open' : ''}`}>
          {PUBLIC_NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`nav-link ${isActive(pathname, n.to) ? 'active' : ''}`}
            >
              {n.label}
            </Link>
          ))}

          {user ? (
            <Link
              to="/admin"
              className={`nav-link ${isActive(pathname, '/admin') ? 'active' : ''}`}
            >
              Manager
            </Link>
          ) : (
            <Link
              to="/login"
              className={`nav-link ${isActive(pathname, '/login') ? 'active' : ''}`}
            >
              Login
            </Link>
          )}
        </div>

        <div className="nav-actions">
          <MagneticButton
            as="a"
            href={`tel:${(content?.brand?.phone || '').replace(/[^\d+]/g, '')}`}
            className="btn btn-ember btn-sm btn-arrow"
            strength={8}
          >
            Reserve
          </MagneticButton>
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
          <span className="brandline">{brand}</span>
          &nbsp;·&nbsp; {content?.brand?.location_city},{' '}
          {content?.brand?.location_country} &nbsp;·&nbsp;{' '}
          © {new Date().getFullYear()}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontSize: 11,
          }}
        >
          {content?.brand?.instagram || 'Made with care'}
        </span>
      </footer>
    </div>
  );
}
