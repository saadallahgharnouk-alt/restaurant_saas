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

/* ───────────────────────────────────────────────────────────────
   Landing page — the calm restaurant OS.
   Editorial Fraunces hero, interactive canvas, tilt food card,
   feature rows, testimonial grid, CTA band.
   ─────────────────────────────────────────────────────────────── */

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80';

const FEATURE_IMAGES = {
  qr: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  orders:
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
  analytics:
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80',
};

const MARQUEE = [
  'Botanique · Paris',
  'Oyama Ramen · Tokyo',
  'Cafe Tartine · SF',
  'La Nuit Bleue · Lyon',
  'Marzano · Milan',
  'Maison Lune · NYC',
  'Fika Collective · Stockholm',
  'Sora · Melbourne',
];

const FEATURES = [
  {
    eyebrow: 'QR ordering',
    title: (
      <>
        Guests scan. The menu <em>just opens.</em>
      </>
    ),
    body:
      'Print a QR card per table. No app, no signup, no friction — a warm editorial menu that feels designed for this restaurant, not every restaurant.',
    bullets: [
      { strong: 'Table-aware URLs', rest: '— orders hit the kitchen already tagged.' },
      { strong: 'Print-ready cards', rest: '— bulk export in one click.' },
      { strong: 'Fully offline demo', rest: '— rehearse before wiring the backend.' },
    ],
    cta: { label: 'Open QR Studio', to: '/qr' },
    image: FEATURE_IMAGES.qr,
    overlayTL: { label: 'Average scan', value: '1.2s' },
    overlayBR: { label: 'Table', value: '#05' },
  },
  {
    eyebrow: 'Live service',
    title: (
      <>
        From chair to kitchen, <em>without a chit.</em>
      </>
    ),
    body:
      'A single flow: cart → send to kitchen → board lights up. No more printer jams, lost orders, or waving a server down. Your team sees what matters, nothing more.',
    bullets: [
      { strong: 'Pending · Cooking · Ready', rest: ' — a kitchen board anyone can read.' },
      { strong: 'Promo codes', rest: ' — SAVE10 / SAVE20 / WELCOME out of the box.' },
      { strong: 'Drawer-first UX', rest: ' — optimized for phones and one thumb.' },
    ],
    cta: { label: 'See the board', to: '/kitchen' },
    image: FEATURE_IMAGES.orders,
    flip: true,
    overlayTL: { label: 'Ticket', value: '#847' },
    overlayBR: { label: 'Ready in', value: '4:20' },
  },
  {
    eyebrow: 'Quiet analytics',
    title: (
      <>
        Numbers that <em>read like a story.</em>
      </>
    ),
    body:
      "Revenue by day, top dishes, category mix. No dashboards shouting at you — just what this Tuesday did, and what tomorrow's prep should look like.",
    bullets: [
      { strong: 'Live figures', rest: ' — revenue, orders, average ticket, uptime.' },
      { strong: 'Top-item leaderboard', rest: ' — with a calm progress bar.' },
      { strong: 'Category mix', rest: ' — served as a segmented ribbon.' },
    ],
    cta: { label: 'View analytics', to: '/analytics' },
    image: FEATURE_IMAGES.analytics,
    overlayTL: { label: 'This week', value: '$12,450' },
    overlayBR: { label: 'vs last', value: '+12%' },
  },
];

const QUOTES = [
  {
    quote:
      'We rolled this out on a Tuesday. By Friday service, we were taking 30% of orders straight from the table.',
    name: 'Mina R.',
    role: 'Owner · Botanique, Paris',
    initial: 'M',
  },
  {
    quote:
      'The scan page feels like our restaurant — not a generic white-label menu. That matters.',
    name: 'Takeshi O.',
    role: 'Head chef · Oyama, Tokyo',
    initial: 'T',
  },
  {
    quote:
      'My kitchen runs quieter now. We stopped printing chits. Nobody misses them.',
    name: 'Jade P.',
    role: 'Operations · Maison Lune',
    initial: 'J',
  },
];

export default function Landing() {
  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="landing-hero">
        <div className="landing-hero-grid">
          {/* Left — editorial headline */}
          <Reveal as="div" stagger className="stagger">
            <span className="eyebrow">The calm restaurant OS</span>

            <h1 className="landing-hero-title">
              Taste,&nbsp;served
              <br />
              <em>with intention.</em>
            </h1>

            <p className="landing-hero-lead">
              RestauHub is a warm, unhurried operating system for modern
              restaurants — QR menus, live orders, a kitchen board and
              analytics, all quietly in one place.
            </p>

            <div className="landing-hero-cta">
              <MagneticButton
                as={Link}
                to="/qr"
                className="btn btn-ember btn-lg btn-arrow"
              >
                Generate a QR menu
              </MagneticButton>
              <MagneticButton
                as={Link}
                to="/m/1"
                className="btn btn-ghost btn-lg"
                strength={8}
              >
                See a live menu
              </MagneticButton>
            </div>

            <div className="landing-hero-meta">
              <div>
                <strong>
                  <AnimatedNumber value={6423} />
                </strong>
                <span>Orders / month</span>
              </div>
              <div>
                <strong>
                  <AnimatedNumber value={1.2} decimals={1} suffix="s" />
                </strong>
                <span>Avg. scan time</span>
              </div>
              <div>
                <strong>
                  <AnimatedNumber value={99.9} decimals={1} suffix="%" />
                </strong>
                <span>Uptime · 30 d</span>
              </div>
            </div>
          </Reveal>

          {/* Right — tilt photo + chips + canvas */}
          <Reveal>
            <div className="landing-hero-visual">
              <div className="landing-hero-canvas">
                <HeroCanvas density={52} />
              </div>

              <TiltCard className="landing-hero-photo" max={9} glare>
                <img
                  src={HERO_IMAGE}
                  alt="A plated dish, photographed from above"
                  loading="eager"
                />
              </TiltCard>

              <FloatChip
                className="float-chip-1"
                badge="▦"
                label="Table 12"
                value="scanned"
              />
              <FloatChip
                className="float-chip-2"
                badge="$"
                label="Tonight"
                value="$1,284"
              />
              <FloatChip
                className="float-chip-3"
                badge="●"
                label="Live orders"
                value="14"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Marquee ─────────────────────────────────────────── */}
      <Marquee items={MARQUEE} />

      {/* ─── Feature rows ────────────────────────────────────── */}
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto', padding: '0 var(--page-gutter)' }}>
        {FEATURES.map((f, i) => (
          <Reveal key={i}>
            <FeatureRow {...f} />
          </Reveal>
        ))}
      </div>

      {/* ─── Testimonials ────────────────────────────────────── */}
      <section className="quotes-section">
        <Reveal>
          <span className="eyebrow">Loved by calm operators</span>
          <h2 className="page-title" style={{ marginTop: 10, maxWidth: 20 + 'ch' }}>
            Designed for the <em>dinner rush.</em>
          </h2>
        </Reveal>

        <Reveal stagger className="quotes-grid stagger">
          {QUOTES.map((q, i) => (
            <TiltCard key={i} as="article" className="quote-card" max={5}>
              <span className="mark">&ldquo;</span>
              <p>{q.quote}</p>
              <div className="who">
                <div className="avatar">{q.initial}</div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{q.name}</div>
                  <small>{q.role}</small>
                </div>
              </div>
            </TiltCard>
          ))}
        </Reveal>
      </section>

      {/* ─── CTA band ────────────────────────────────────────── */}
      <section className="cta-band">
        <Reveal>
          <div className="cta-inner">
            <div>
              <span className="eyebrow" style={{ color: 'rgba(245,239,227,0.65)' }}>
                Start tonight
              </span>
              <h2>
                Your next <em>service</em>,<br />made quieter.
              </h2>
              <p>
                No credit card, no setup call. Open a workspace, print a QR,
                start taking orders. Your kitchen will notice.
              </p>
            </div>

            <div className="cta-aside">
              <MagneticButton
                as={Link}
                to="/dashboard"
                className="btn btn-ember btn-lg btn-arrow"
              >
                Open the dashboard
              </MagneticButton>
              <MagneticButton
                as={Link}
                to="/qr"
                className="btn btn-ghost-ink btn-lg"
                strength={8}
              >
                Generate a QR menu
              </MagneticButton>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  color: 'rgba(245,239,227,0.55)',
                  marginTop: 10,
                  textTransform: 'uppercase',
                }}
              >
                Already serving · 6 venues · Morocco · France · Japan
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────── */

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

function FeatureRow({
  eyebrow,
  title,
  body,
  bullets,
  cta,
  image,
  flip,
  overlayTL,
  overlayBR,
}) {
  return (
    <article className={`feature-row ${flip ? 'flip' : ''}`.trim()}>
      <div className="fr-text">
        <span className="eyebrow">{eyebrow}</span>
        <h3>{title}</h3>
        <p>{body}</p>

        {bullets?.length > 0 && (
          <ul className="fr-bullets">
            {bullets.map((b, i) => (
              <li key={i}>
                <div>
                  <strong>{b.strong}</strong>
                  {b.rest}
                </div>
              </li>
            ))}
          </ul>
        )}

        {cta && (
          <MagneticButton
            as={Link}
            to={cta.to}
            className="btn btn-ghost btn-arrow"
            strength={8}
          >
            {cta.label}
          </MagneticButton>
        )}
      </div>

      <TiltCard className="fr-visual" max={5} glare={false}>
        <img src={image} alt="" loading="lazy" />

        {overlayTL && (
          <div className="overlay tl">
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.12em',
                color: 'var(--ink-faint)',
                textTransform: 'uppercase',
              }}
            >
              {overlayTL.label}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                fontWeight: 500,
                color: 'var(--ink)',
                letterSpacing: '-0.02em',
              }}
            >
              {overlayTL.value}
            </div>
          </div>
        )}

        {overlayBR && (
          <div className="overlay br">
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.12em',
                color: 'var(--ink-faint)',
                textTransform: 'uppercase',
              }}
            >
              {overlayBR.label}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                fontWeight: 500,
                color: 'var(--ember-deep)',
                letterSpacing: '-0.02em',
              }}
            >
              {overlayBR.value}
            </div>
          </div>
        )}
      </TiltCard>
    </article>
  );
}
