import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV = [
  { path: '/',             label: 'Dashboard',   icon: '◉' },
  { path: '/restaurants',  label: 'Restaurants', icon: '◈' },
  { path: '/menu',         label: 'Menu',        icon: '◍' },
  { path: '/kitchen',      label: 'Kitchen',     icon: '✦' },
  { path: '/order',        label: 'Orders',      icon: '⬢' },
  { path: '/qr',           label: 'QR Codes',    icon: '▦' },
  { path: '/analytics',    label: 'Analytics',   icon: '◎' },
];

export default function EnhancedLayout({ children }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <div className="app">
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-brand" onClick={() => setOpen(false)}>
          <img src="/logo-mark.svg" alt="" width="28" height="28" style={{ filter: 'drop-shadow(0 0 8px var(--accent-glow))' }} />
          <div className="brand-text">
            <span className="brand-name">RestauHub</span>
            <span className="brand-sub">Restaurant OS</span>
          </div>
        </Link>

        <div className={`nav-links ${open ? 'open' : ''}`}>
          {NAV.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${active ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {active && <span className="nav-dot" />}
              </Link>
            );
          })}
        </div>

        <div className="nav-actions">
          <div className="status-pill">
            <span className="status-dot" />
            LIVE
          </div>
          <button
            type="button"
            aria-label="Toggle navigation"
            className="nav-burger"
            onClick={() => setOpen(v => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>

      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '20px 28px',
        color: 'var(--text-mid)',
        fontSize: 12,
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <span>© {new Date().getFullYear()} RestauHub · Restaurant OS</span>
        <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
          BUILT WITH REACT · VITE · NODE
        </span>
      </footer>
    </div>
  );
}
