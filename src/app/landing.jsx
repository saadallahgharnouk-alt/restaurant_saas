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
   Landing page — dark, food-forward, neon title accent.
   Three pages only: Home · Menu · Manager.
   ─────────────────────────────────────────────────────────────── */

// Moody, professional food photography
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=80';
// Alt (steak, very dark): photo-1544025162-d76694265947
// Current pick: dramatic meat shot on dark board

const FEATURE_IMAGES = {
  menu:
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80',
  manager:
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80',
  experience:
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80',
};

const MARQUEE = [
  'Fire & Smoke',
  'House Ramen',
  'Flame-Grilled',
  'Signature Burger',
  'Wood-Fired Pizza',
  'Sunday Brunch',
  'Chef\u2019s Tasting',
  'Late-Night Menu',
];

const FEATURES = [
  {
    eyebrow: 'Your digital menu',
    title: (
      <>
        A menu that <em>looks</em> as good as it tastes.
      </>
    ),
    body:
      'Beautifully styled cards, clean category flow, thumb-friendly. Guests scan a QR, browse your menu, and add to cart — no app, no signup, no friction.',
    bullets: [
      { strong: 'Photography-first', rest: ' layout that makes dishes pop.' },
      { strong: 'Category filters', rest: ' — Starters, Mains, Sides, Drinks.' },
      { strong: 'Live pricing', rest: ' — update once, it\u2019s live everywhere.' },
    ],
    cta: { label: 'Preview a menu', to: '/m/1' },
    image: FEATURE_IMAGES.menu,
    overlayTL: { label: 'Avg. scan', value: '1.2s' },
    overlayBR: { label: 'Table', value: '#05' },
  },
  {
    eyebrow: 'Manager control',
    title: (
      <>
        Your entire service, <em>in one place.</em>
      </>
    ),
    body:
      'Watch orders land in real time. Track revenue, top dishes, and service mix from a dashboard designed to be read at a glance — even mid-rush.',
    bullets: [
      { strong: 'Live order feed', rest: ' — pending, cooking, ready.' },
      { strong: 'Revenue & top items', rest: ' — today, this week, this month.' },
      { strong: 'Menu editor', rest: ' — update dishes, prices, photos in seconds.' },
    ],
    cta: { label: 'Open Manager', to: '/dashboard' },
    image: FEATURE_IMAGES.manager,
    flip: true,
    overlayTL: { label: 'Ticket', value: '#847' },
    overlayBR: { label: 'Tonight', value: '$1,284' },
  },
  {
    eyebrow: 'The experience',
    title: (
      <>
        Guests <em>feel</em> the difference.
      </>
    ),
    body:
      'Less waiting, less pointing, more enjoying. Your team spends time on hospitality — not chasing tables for orders. Your restaurant just feels more modern.',
    bullets: [
      { strong: 'No staff bottleneck', rest: ' — guests order when they\u2019re ready.' },
      { strong: 'Fewer order errors', rest: ' — exactly what they tapped, arrives.' },
      { strong: 'Table turnover up', rest: ' — fewer minutes waiting to order.' },
    ],
    cta: { label: 'See the menu', to: '/menu' },
    image: FEATURE_IMAGES.experience,
    overlayTL: { label: 'Table turn', value: '+18%' },
    overlayBR: { label: 'Error rate', value: '−62%' },
  },
];

const QUOTES = [
  {
    quote:
      'Opened on a Tuesday. By Friday service, a third of our orders came straight from the table.',
    name: 'Mina R.',
    role: 'Owner · Botanique, Paris',
    initial: 'M',
  },
  {
    quote:
      'The menu looks like our restaurant — not a generic white-label. My photos finally get the stage they deserve.',
    name: 'Takeshi O.',
    role: 'Head chef · Oyama, Tokyo',
    initial: 'T',
  },
  {
    quote:
      'My kitchen runs quieter. Orders just show up where they should. We stopped printing chits.',
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
            <span className="eyebrow">Modern restaurant platform</span>

            <h1 className="landing-hero-title">
              The menu.
              <br />
              The service.
              <br />
              <em>Elevated.</em>
            </h1>

            <p className="landing-hero-lead">
              A digital menu, a manager dashboard, and a guest experience
              that feels designed for your restaurant — not every restaurant.
              Dark, modern, beautifully built.
            </p>

            <div className="landing-hero-cta">
              <MagneticButton
                as={Link}
                to="/menu"
                className="btn btn-ember btn-lg btn-arrow"
              >
                View the menu
              </MagneticButton>
              <MagneticButton
                as={Link}
                to="/dashboard"
                className="btn btn-ghost btn-lg"
                strength={8}
              >
                Open Manager
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
                <span>Uptime</span>
              </div>
            </div>
          </Reveal>

          {/* Right — tilt food photo + chips + canvas */}
          <Reveal>
            <div className="landing-hero-visual">
              <div className="landing-hero-canvas">
                <HeroCanvas density={40} />
              </div>

              <TiltCard className="landing-hero-photo" max={9} glare>
                <img
                  src={HERO_IMAGE}
                  alt="A plated dish under dramatic light"
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

      {/* ─── Marquee of dish concepts ────────────────────────── */}
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
          <span className="eyebrow">Loved by modern operators</span>
          <h2 className="page-title" style={{ marginTop: 12, maxWidth: '20ch' }}>
            Built for the <em>dinner rush.</em>
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
                  <div style={{ fontWeight: 600, color: 'var(--fg)' }}>{q.name}</div>
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
              <span className="eyebrow">Start tonight</span>
              <h2>
                Your next <em>service</em>,<br />made modern.
              </h2>
              <p>
                No credit card, no setup call. Open a workspace, share the
                menu link, start taking orders. Your guests will notice first.
              </p>
            </div>

            <div className="cta-aside">
              <MagneticButton
                as={Link}
                to="/dashboard"
                className="btn btn-ember btn-lg btn-arrow"
              >
                Open Manager
              </MagneticButton>
              <MagneticButton
                as={Link}
                to="/menu"
                className="btn btn-ghost-ink btn-lg"
                strength={8}
              >
                View the menu
              </MagneticButton>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  color: 'var(--fg-faint)',
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
                color: 'var(--fg-faint)',
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
                color: 'var(--fg)',
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
                color: 'var(--fg-faint)',
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
                color: 'var(--neon)',
                letterSpacing: '-0.02em',
                textShadow: '0 0 14px rgba(255,107,31,0.35)',
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
