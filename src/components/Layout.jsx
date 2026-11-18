import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth-context.js';
import { useContent } from '../lib/content-context.js';
import WhatsAppCTA from './WhatsAppCTA';

/**
 * Layout — top nav + page outlet + footer.
 * Reads brand name, logo, and contact info from the CMS.
 */
export default function Layout() {
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const { isAuthenticated, signOut } = useAuth();
  const { content } = useContent();

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [previousPathname, setPreviousPathname] = useState(pathname);

  if (pathname !== previousPathname) {
    setPreviousPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const branding = content?.branding;
  const contact  = content?.contact;
  const name     = branding?.restaurantName || 'Restaurant';
  const logoUrl  = branding?.logoUrl;

  const onAdminPage = pathname.startsWith('/admin');

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <div className="app">
      <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <Link to="/" className="nav-brand" aria-label={`${name} home`}>
          {logoUrl ? (
            <img src={logoUrl} alt="" className="nav-brand-logo" />
          ) : (
            <span className="nav-brand-mark" aria-hidden>◆</span>
          )}
          <span className="nav-brand-text">{name}</span>
        </Link>

        <nav className={`nav-links ${open ? 'nav-links--open' : ''}`}>
          <NavLink end to="/"     className="nav-link">Home</NavLink>
          <NavLink     to="/menu" className="nav-link">Menu</NavLink>
          {isAuthenticated && (
            <NavLink to="/admin" className="nav-link">Edit Site</NavLink>
          )}
        </nav>

        <div className="nav-actions">
          {/* WhatsApp CTA — always visible if number is set */}
          <span className="nav-wa-wrap">
            <WhatsAppCTA contact={contact} compact />
          </span>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="btn btn-ghost btn-sm nav-action-btn"
            >
              Sign out
            </button>
          ) : (
            !onAdminPage && (
              <Link to="/admin" className="btn btn-ghost btn-sm nav-action-btn">
                Manager
              </Link>
            )
          )}

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            className="nav-burger"
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <SiteFooter content={content} />
    </div>
  );
}

/* ─── Footer ──────────────────────────────────────────────────────────── */

function SiteFooter({ content }) {
  const branding = content?.branding;
  const contact  = content?.contact;
  const location = content?.location;
  const name     = branding?.restaurantName || 'Restaurant';
  const tagline  = branding?.tagline;
  const year     = new Date().getFullYear();

  const phone = contact?.phoneNumber?.trim();
  const phoneDigits = (phone || '').replace(/\D/g, '');
  const phoneHref   = phoneDigits.length >= 8 ? `tel:${phone.replace(/[^\d+]/g, '')}` : null;

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-brand-name">{name}</div>
          {tagline && <div className="footer-brand-tagline">{tagline}</div>}
        </div>

        <div className="footer-cols">
          {location?.address?.trim() && (
            <div className="footer-col">
              <div className="footer-col-label">Find us</div>
              <div className="footer-col-text">{location.address}</div>
            </div>
          )}

          {(phoneHref || (contact?.whatsappNumber || '').replace(/\D/g, '').length >= 8) && (
            <div className="footer-col">
              <div className="footer-col-label">Contact</div>
              {phoneHref && (
                <a href={phoneHref} className="footer-col-link">{phone}</a>
              )}
              <span className="footer-col-text" style={{ marginTop: 6 }}>
                <WhatsAppCTA contact={contact} compact />
              </span>
            </div>
          )}

          {contact?.hours?.length > 0 && (
            <div className="footer-col">
              <div className="footer-col-label">Hours</div>
              {contact.hours.map((h, i) => (
                <div key={i} className="footer-hour-row">
                  <span>{h.day.slice(0, 3)}</span>
                  <span>{h.closed ? 'Closed' : `${h.open}–${h.close}`}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="footer-meta">
        <span>© {year} {name}</span>
        <Link to="/admin" className="footer-meta-link">Manager</Link>
      </div>
    </footer>
  );
}
