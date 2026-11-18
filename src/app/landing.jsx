import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../lib/content-context.js';
import MapEmbed from '../components/MapEmbed';
import WhatsAppCTA from '../components/WhatsAppCTA';

/* ─── Fallback images (used when CMS images are empty) ─────────────────── */

const FALLBACK_HERO =
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80';
const FALLBACK_FEATURE =
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80';
const FALLBACK_DISH =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80';

const PLACE_ROW = (i) =>
  i % 2 === 0
    ? 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80'
    : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80';

/* ──────────────────────────────────────────────────────────────────────── */

export default function Landing() {
  const { content } = useContent();

  const branding = content?.branding;
  const landing  = content?.landing;
  const location = content?.location;
  const contact  = content?.contact;
  const menu     = content?.menu;

  const heroImage = landing?.heroImageUrl?.trim() || FALLBACK_HERO;
  const features  = (landing?.features?.length >= 1) ? landing.features : null;

  // Pick up to 3 active items to highlight on the landing
  const featuredDishes = useMemo(() => {
    const items = (menu?.items || []).filter((it) => it.active !== false);
    return items.slice(0, 3);
  }, [menu]);

  return (
    <>
      {/* ─── Hero ───────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            {branding?.tagline && (
              <span className="eyebrow">{branding.tagline}</span>
            )}
            <h1 className="hero-title">
              {landing?.heroHeadline || `Welcome to ${branding?.restaurantName || 'our table'}.`}
            </h1>
            <p className="hero-lead">
              {landing?.heroLead ||
                'Crafted dishes, warm service, and a place that feels like home. We can\u2019t wait to host you.'}
            </p>

            <div className="hero-cta">
              <Link to="/menu" className="btn btn-ember btn-lg">
                View the Menu
              </Link>
              <WhatsAppCTA contact={contact} />
            </div>

            <ul className="hero-marquee">
              {(landing?.marqueeItems?.length ? landing.marqueeItems : ['Fresh', 'Seasonal', 'Halal'])
                .slice(0, 6)
                .map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
            </ul>
          </div>

          <div className="hero-visual">
            <div className="hero-photo">
              <img src={heroImage} alt="" loading="eager" />
            </div>
            <div className="hero-photo-glow" aria-hidden />
          </div>
        </div>
      </section>

      {/* ─── About / Feature rows ───────────────────────────────────────── */}
      {features && (
        <section className="features">
          {features.map((f, i) => (
            <FeatureRow key={i} feature={f} flip={i % 2 === 1} fallbackImage={PLACE_ROW(i)} />
          ))}
        </section>
      )}

      {/* ─── Featured dishes preview ────────────────────────────────────── */}
      {featuredDishes.length > 0 && (
        <section className="dish-preview">
          <header className="section-head">
            <span className="eyebrow">From the menu</span>
            <h2 className="section-title">A taste of what awaits</h2>
            <p className="section-sub">
              Hand-picked favourites from our kitchen. See the full menu for the rest.
            </p>
          </header>

          <div className="dish-grid">
            {featuredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>

          <div className="dish-preview-cta">
            <Link to="/menu" className="btn btn-ghost btn-lg">
              See full menu &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* ─── Find us ────────────────────────────────────────────────────── */}
      <section className="find-us">
        <header className="section-head">
          <span className="eyebrow">Find us</span>
          <h2 className="section-title">Visit our table</h2>
        </header>

        <div className="find-us-grid">
          <div className="find-us-map">
            <MapEmbed location={location} />
          </div>

          <div className="find-us-info">
            {location?.address?.trim() && (
              <InfoBlock label="Address">
                <p className="info-text">{location.address}</p>
              </InfoBlock>
            )}

            {contact?.phoneNumber?.trim() && (
              <InfoBlock label="Phone">
                <a
                  href={`tel:${contact.phoneNumber.replace(/[^\d+]/g, '')}`}
                  className="info-link"
                >
                  {contact.phoneNumber}
                </a>
              </InfoBlock>
            )}

            <InfoBlock label="Order direct">
              <WhatsAppCTA contact={contact} />
            </InfoBlock>

            {contact?.hours?.length > 0 && (
              <InfoBlock label="Opening hours">
                <ul className="hours-list">
                  {contact.hours.map((h, i) => (
                    <li key={i} className={h.closed ? 'is-closed' : ''}>
                      <span>{h.day}</span>
                      <span>{h.closed ? 'Closed' : `${h.open} – ${h.close}`}</span>
                    </li>
                  ))}
                </ul>
              </InfoBlock>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── FeatureRow ───────────────────────────────────────────────────────── */

function FeatureRow({ feature, flip, fallbackImage }) {
  const image = feature.imageUrl?.trim() || fallbackImage || FALLBACK_FEATURE;
  return (
    <article className={`feature-row${flip ? ' feature-row--flip' : ''}`}>
      <div className="feature-row-text">
        {feature.eyebrow && <span className="eyebrow">{feature.eyebrow}</span>}
        <h3 className="feature-row-title">{feature.title}</h3>
        <p className="feature-row-body">{feature.body}</p>

        {feature.bullets?.length > 0 && (
          <ul className="feature-bullets">
            {feature.bullets.map((b, j) => (
              <li key={j}>
                <strong>{b.strong}</strong>
                {b.rest ? ` ${b.rest}` : null}
              </li>
            ))}
          </ul>
        )}

        {feature.ctaLabel && (
          <Link
            to={feature.ctaHref || '/menu'}
            className="btn btn-ghost"
          >
            {feature.ctaLabel} &rarr;
          </Link>
        )}
      </div>

      <div className="feature-row-visual">
        <img src={image} alt="" loading="lazy" />
      </div>
    </article>
  );
}

/* ─── DishCard (preview, simplified) ───────────────────────────────────── */

function DishCard({ dish }) {
  const photo = dish.photoUrl?.trim() || FALLBACK_DISH;
  const price = formatPrice(dish.priceCents, dish.currency);

  return (
    <article className="dish-card">
      <div className="dish-card-photo">
        <img src={photo} alt={dish.name} loading="lazy" />
      </div>
      <div className="dish-card-body">
        <h4 className="dish-card-name">{dish.name}</h4>
        {dish.description && (
          <p className="dish-card-desc">{dish.description}</p>
        )}
        <div className="dish-card-price">{price}</div>
      </div>
    </article>
  );
}

/* ─── Info block helper ────────────────────────────────────────────────── */

function InfoBlock({ label, children }) {
  return (
    <div className="info-block">
      <div className="info-block-label">{label}</div>
      {children}
    </div>
  );
}

/* ─── Helpers ──────────────────────────────────────────────────────────── */

function formatPrice(cents, currency) {
  const value = (cents / 100).toFixed(2);
  if (currency === 'EUR') return `€${value}`;
  if (currency === 'USD') return `$${value}`;
  return `${value} MAD`;
}
