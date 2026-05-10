import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeroCanvas,
  MagneticButton,
  TiltCard,
  AnimatedNumber,
  Reveal,
  Marquee,
} from '../components/primitives';
import { useContent } from '../lib/content-store';
import ContactSection from '../components/ContactSection';
import WhatsAppCTA from '../components/WhatsAppCTA';

/* ───────────────────────────────────────────────────────────────
   Landing page — reads from CMS Content_Store.
   Falls back to inline defaults when content is loading.
   ─────────────────────────────────────────────────────────────── */

// Fallback images for when CMS has empty URLs
const FALLBACK_HERO_IMAGE =
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=80';
const FALLBACK_FEATURE_IMAGE =
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80';

const FALLBACK_QUOTES = [
  {
    quote: 'Opened on a Tuesday. By Friday service, a third of our orders came straight from the table.',
    name: 'Mina R.',
    role: 'Owner · Botanique, Paris',
    initial: 'M',
  },
  {
    quote: 'The menu looks like our restaurant — not a generic white-label. My photos finally get the stage they deserve.',
    name: 'Takeshi O.',
    role: 'Head chef · Oyama, Tokyo',
    initial: 'T',
  },
  {
    quote: 'My kitchen runs quieter. Orders just show up where they should. We stopped printing chits.',
    name: 'Jade P.',
    role: 'Operations · Maison Lune',
    initial: 'J',
  },
];

export default function Landing() {
  const { content } = useContent();
  const landing = content?.landing;
  const branding = content?.branding;
  const location = content?.location;
  const contact = content?.contact;

  // Derive values from CMS or fallbacks
  const heroHeadline = landing?.heroHeadline || "Flavors of Morocco, served with soul.";
  const heroLead = landing?.heroLead || "A digital menu, a manager dashboard, and a guest experience that feels designed for your restaurant.";
  const heroImageUrl = landing?.heroImageUrl || FALLBACK_HERO_IMAGE;
  const marqueeItems = landing?.marqueeItems?.length > 0 ? landing.marqueeItems : ['Tagine', 'Couscous', 'Pastilla', 'Harira', 'Msemen', 'Mint Tea'];
  const features = landing?.features?.length >= 3 ? landing.features : null;

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="landing-hero">
        <div className="landing-hero-grid">
          <Reveal as="div" stagger className="stagger">
            <span className="eyebrow">
              {branding?.tagline || 'Modern restaurant platform'}
            </span>

            <h1 className="landing-hero-title">
              <HeroHeadlineRender text={heroHeadline} />
            </h1>

            <p className="landing-hero-lead">{heroLead}</p>

            <div className="landing-hero-cta">
              <MagneticButton as={Link} to="/menu" className="btn btn-ember btn-lg btn-arrow">
                View the menu
              </MagneticButton>
              <MagneticButton as={Link} to="/dashboard" className="btn btn-ghost btn-lg" strength={8}>
                Open Manager
              </MagneticButton>
              <WhatsAppCTA contact={contact} />
            </div>

            <div className="landing-hero-meta">
              <div>
                <strong><AnimatedNumber value={6423} /></strong>
                <span>Orders / month</span>
              </div>
              <div>
                <strong><AnimatedNumber value={1.2} decimals={1} suffix="s" /></strong>
                <span>Avg. scan time</span>
              </div>
              <div>
                <strong><AnimatedNumber value={99.9} decimals={1} suffix="%" /></strong>
                <span>Uptime</span>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="landing-hero-visual">
              <div className="landing-hero-canvas">
                <HeroCanvas density={40} />
              </div>
              <TiltCard className="landing-hero-photo" max={9} glare>
                <img src={heroImageUrl} alt="Restaurant dish" loading="eager" />
              </TiltCard>
              <FloatChip className="float-chip-1" badge="▦" label="Table 12" value="scanned" />
              <FloatChip className="float-chip-2" badge="$" label="Tonight" value="$1,284" />
              <FloatChip className="float-chip-3" badge="●" label="Live orders" value="14" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Marquee ─────────────────────────────────────────── */}
      <Marquee items={marqueeItems} />

      {/* ─── Feature rows ────────────────────────────────────── */}
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto', padding: '0 var(--page-gutter)' }}>
        {features ? (
          features.map((f, i) => (
            <Reveal key={i}>
              <FeatureRow
                eyebrow={f.eyebrow}
                title={f.title}
                body={f.body}
                bullets={f.bullets}
                cta={f.ctaLabel ? { label: f.ctaLabel, to: f.ctaHref || '/menu' } : null}
                image={f.imageUrl || FALLBACK_FEATURE_IMAGE}
                flip={i % 2 === 1}
              />
            </Reveal>
          ))
        ) : (
          <DefaultFeatures />
        )}
      </div>

      {/* ─── Testimonials ────────────────────────────────────── */}
      <section className="quotes-section">
        <Reveal>
          <span className="eyebrow">Loved by modern operators</span>
          <h2 className="page-title" style={{ marginTop: 12, maxWidth: '20ch' }}>
            Built for the <em>dinner rush.</em>
          </h2>
        </Reveal>
        <Reveal stagger className="quotes-grid stagger">
          {FALLBACK_QUOTES.map((q, i) => (
            <TiltCard key={i} as="article" className="quote-card" max={5}>
              <span className="mark">&ldquo;</span>
              <p>{q.quote}</p>
              <div className="who">
                <div className="avatar">{q.initial}</div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--fg)' }}>{q.name}</div>
                  <small>{q.role}</small>
                </div>
              </div>
            </TiltCard>
          ))}
        </Reveal>
      </section>

      {/* ─── Contact Section ────────────────────────────────── */}
      <ContactSection location={location} contact={contact} />

      {/* ─── CTA band ────────────────────────────────────────── */}
      <section className="cta-band">
        <Reveal>
          <div className="cta-inner">
            <div>
              <span className="eyebrow">Start tonight</span>
              <h2>Your next <em>service</em>,<br />made modern.</h2>
              <p>No credit card, no setup call. Open a workspace, share the menu link, start taking orders.</p>
            </div>
            <div className="cta-aside">
              <MagneticButton as={Link} to="/dashboard" className="btn btn-ember btn-lg btn-arrow">
                Open Manager
              </MagneticButton>
              <MagneticButton as={Link} to="/menu" className="btn btn-ghost-ink btn-lg" strength={8}>
                View the menu
              </MagneticButton>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

/* ─── Hero headline renderer — wraps last word in <em> for neon effect ─── */

function HeroHeadlineRender({ text }) {
  // If text contains markdown-style *emphasis*, render as <em>
  const parts = text.split(/\*(.*?)\*/);
  if (parts.length > 1) {
    return parts.map((part, i) => i % 2 === 1 ? <em key={i}>{part}</em> : part);
  }
  // Otherwise wrap the last sentence/word after last comma or period
  const lastDot = Math.max(text.lastIndexOf('.'), text.lastIndexOf(','));
  if (lastDot > 0 && lastDot < text.length - 2) {
    return <>{text.slice(0, lastDot + 1)}<br /><em>{text.slice(lastDot + 1).trim()}</em></>;
  }
  // Fallback: just render as-is
  return <>{text}</>;
}

/* ─── Default features (used when CMS has no features yet) ─────────────── */

function DefaultFeatures() {
  const defaults = [
    {
      eyebrow: 'Your digital menu',
      title: 'A menu that looks as good as it tastes.',
      body: 'Beautifully styled cards, clean category flow, thumb-friendly. Guests scan a QR, browse your menu, and add to cart.',
      bullets: [{ strong: 'Photography-first', rest: ' layout that makes dishes pop.' }, { strong: 'Live pricing', rest: ' — update once, live everywhere.' }],
      cta: { label: 'Preview a menu', to: '/m/1' },
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80',
    },
    {
      eyebrow: 'Manager control',
      title: 'Your entire service, in one place.',
      body: 'Watch orders land in real time. Track revenue, top dishes, and service mix from a dashboard designed to be read at a glance.',
      bullets: [{ strong: 'Live order feed', rest: ' — pending, cooking, ready.' }, { strong: 'Revenue & top items', rest: ' — today, this week, this month.' }],
      cta: { label: 'Open Manager', to: '/dashboard' },
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80',
      flip: true,
    },
    {
      eyebrow: 'The experience',
      title: 'Guests feel the difference.',
      body: 'Less waiting, less pointing, more enjoying. Your team spends time on hospitality — not chasing tables for orders.',
      bullets: [{ strong: 'No staff bottleneck', rest: ' — guests order when ready.' }, { strong: 'Table turnover up', rest: ' — fewer minutes waiting.' }],
      cta: { label: 'See the menu', to: '/menu' },
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80',
    },
  ];

  return defaults.map((f, i) => (
    <Reveal key={i}><FeatureRow {...f} flip={i % 2 === 1} /></Reveal>
  ));
}

/* ─── Feature Row ─────────────────────────────────────────────────────────── */

function FeatureRow({ eyebrow, title, body, bullets, cta, image, flip }) {
  return (
    <article className={`feature-row ${flip ? 'flip' : ''}`.trim()}>
      <div className="fr-text">
        <span className="eyebrow">{eyebrow}</span>
        <h3>{typeof title === 'string' ? <TitleRender text={title} /> : title}</h3>
        <p>{body}</p>
        {bullets?.length > 0 && (
          <ul className="fr-bullets">
            {bullets.map((b, i) => (
              <li key={i}><div><strong>{b.strong}</strong>{b.rest}</div></li>
            ))}
          </ul>
        )}
        {cta && (
          <MagneticButton as={Link} to={cta.to} className="btn btn-ghost btn-arrow" strength={8}>
            {cta.label}
          </MagneticButton>
        )}
      </div>
      <TiltCard className="fr-visual" max={5} glare={false}>
        <img src={image} alt="" loading="lazy" />
      </TiltCard>
    </article>
  );
}

function TitleRender({ text }) {
  // Wrap *text* in <em> tags
  const parts = text.split(/\*(.*?)\*/);
  if (parts.length > 1) {
    return parts.map((part, i) => i % 2 === 1 ? <em key={i}>{part}</em> : part);
  }
  return <>{text}</>;
}

/* ─── Float Chip ──────────────────────────────────────────────────────────── */

function FloatChip({ className, badge, label, value }) {
  return (
    <div className={`float-chip ${className || ''}`.trim()}>
      <span className="ic">{badge}</span>
      <div>
        <div className="lbl">{label}</div>
        <div className="val">{value}</div>
      </div>
    </div>
  );
}
