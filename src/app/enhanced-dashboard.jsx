import React from 'react';
import { Link } from 'react-router-dom';
import {
  Reveal,
  TiltCard,
  MagneticButton,
  AnimatedNumber,
} from '../components/primitives';

/* ───────────────────────────────────────────────────────────────
   Admin overview at /dashboard — calm, numeric, linkable.
   A tight editorial page with 4 KPI stats, 4 feature tiles,
   a recent-activity list, and a CTA back to QR Studio.
   ─────────────────────────────────────────────────────────────── */

const KPIS = [
  { label: 'Revenue · this week',  value: 12450, prefix: '$', delta: '+12%', up: true },
  { label: 'Orders · today',       value: 147,               delta: '+18',  up: true },
  { label: 'Average ticket',       value: 28.4,  prefix: '$', decimals: 1, delta: '-3%',  up: false },
  { label: 'Tables scanned',       value: 62,    suffix: '%', delta: '+6%',  up: true },
];

const TILES = [
  {
    eyebrow: 'QR ordering',
    title: 'Generate QR menus',
    body: 'One universal QR, per-table QR, or a full printable sheet for every seat.',
    to: '/qr',
    icon: '▦',
  },
  {
    eyebrow: 'Service',
    title: 'Open kitchen board',
    body: 'Pending · Cooking · Ready. Drag a ticket, it flies into the kitchen.',
    to: '/kitchen',
    icon: '✦',
  },
  {
    eyebrow: 'Menu',
    title: 'Edit the menu',
    body: 'Add dishes, mark them 86, set prices and categories.',
    to: '/menu/manage',
    icon: '◍',
  },
  {
    eyebrow: 'Insight',
    title: 'See what sold',
    body: 'Revenue by day, top dishes, category mix — served quietly.',
    to: '/analytics',
    icon: '◎',
  },
];

const ACTIVITY = [
  { when: '2 min ago',  who: 'Table 07',  what: 'placed 3 items',        amount: '$42.00',  tone: 'sage' },
  { when: '5 min ago',  who: 'Kitchen',    what: 'marked #847 ready',     amount: null,      tone: 'ink' },
  { when: '9 min ago',  who: 'Table 12',  what: 'placed 2 items',        amount: '$28.50',  tone: 'sage' },
  { when: '14 min ago', who: 'Admin',      what: 'added a new dish',      amount: null,      tone: 'ink' },
  { when: '22 min ago', who: 'Table 03',  what: 'placed 5 items',        amount: '$74.20',  tone: 'sage' },
  { when: '31 min ago', who: 'Promo',      what: 'WELCOME applied',       amount: '-$8.00',  tone: 'ember' },
];

export default function Dashboard() {
  return (
    <div className="page">
      {/* ── Header ─────────────────────────────────────────── */}
      <Reveal as="div" className="page-header">
        <span className="eyebrow">Service · Tonight</span>
        <h1 className="page-title">
          Good evening.<br />
          Your kitchen is <em>humming</em>.
        </h1>
        <p className="page-sub">
          Orders move through. Guests scan and go. Here&apos;s the calm
          picture of where tonight&apos;s service is.
        </p>

        <div style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'wrap' }}>
          <MagneticButton as={Link} to="/qr" className="btn btn-ember btn-arrow">
            Generate a QR menu
          </MagneticButton>
          <MagneticButton as={Link} to="/kitchen" className="btn btn-ghost" strength={8}>
            Open kitchen board
          </MagneticButton>
          <MagneticButton as={Link} to="/analytics" className="btn btn-ghost" strength={8}>
            View analytics
          </MagneticButton>
        </div>
      </Reveal>

      {/* ── KPI stats ─────────────────────────────────────── */}
      <Reveal stagger className="grid-4 stagger" style={{ marginBottom: 40 }}>
        {KPIS.map((k, i) => (
          <TiltCard key={i} as="div" className="stat" max={6}>
            <div className="stat-label">{k.label}</div>
            <div className="stat-value">
              <AnimatedNumber
                value={k.value}
                prefix={k.prefix}
                suffix={k.suffix}
                decimals={k.decimals || 0}
              />
            </div>
            <div className={`stat-delta ${k.up ? 'up' : 'down'}`}>
              {k.up ? '↑' : '↓'} {k.delta} <span style={{ color: 'var(--ink-faint)', fontWeight: 400 }}>vs last week</span>
            </div>
          </TiltCard>
        ))}
      </Reveal>

      {/* ── Feature tiles ─────────────────────────────────── */}
      <Reveal>
        <span className="eyebrow" style={{ marginBottom: 12 }}>Do something</span>
        <h2
          className="page-title"
          style={{ fontSize: 'clamp(26px,3.2vw,38px)', marginBottom: 28 }}
        >
          Quick <em>moves</em>.
        </h2>
      </Reveal>

      <Reveal stagger className="grid-2 stagger" style={{ marginBottom: 48 }}>
        {TILES.map((t, i) => (
          <TiltCard key={i} as="div" className="card-feature" max={7}>
            <Link
              to={t.to}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                position: 'relative',
                zIndex: 2,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'var(--ember-tint)',
                  border: '1px solid rgba(232,111,78,0.25)',
                  color: 'var(--ember-deep)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  fontFamily: 'var(--font-display)',
                }}
              >
                {t.icon}
              </div>
              <div>
                <span className="eyebrow">{t.eyebrow}</span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 24,
                    fontWeight: 500,
                    letterSpacing: '-0.02em',
                    color: 'var(--ink)',
                    marginTop: 8,
                  }}
                >
                  {t.title}
                </h3>
              </div>
              <p style={{ color: 'var(--ink-mid)', fontSize: 14, lineHeight: 1.55, maxWidth: '34ch' }}>
                {t.body}
              </p>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--ember-deep)',
                  letterSpacing: '0.08em',
                  marginTop: 'auto',
                  textTransform: 'uppercase',
                }}
              >
                Open <span style={{ fontSize: 14 }}>→</span>
              </div>
            </Link>
          </TiltCard>
        ))}
      </Reveal>

      {/* ── Activity + Live card ─────────────────────────── */}
      <div className="grid-2" style={{ gridTemplateColumns: 'minmax(0,1.35fr) minmax(0,1fr)', gap: 20 }}>
        <Reveal>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                borderBottom: '1px solid var(--rule)',
              }}
            >
              <div>
                <span className="eyebrow">Recent activity</span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 20,
                    fontWeight: 500,
                    letterSpacing: '-0.015em',
                    marginTop: 4,
                  }}
                >
                  A calm feed.
                </h3>
              </div>
              <span className="status-dot">Live</span>
            </div>

            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {ACTIVITY.map((a, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '14px 24px',
                    borderBottom:
                      i === ACTIVITY.length - 1 ? 'none' : '1px solid var(--rule-soft)',
                    animation: `cardIn 0.4s ${i * 0.05}s var(--ease-out) both`,
                  }}
                >
                  <span
                    className={`badge ${
                      a.tone === 'sage' ? 'badge-sage' : a.tone === 'ember' ? 'badge-ember' : 'badge-soft'
                    }`}
                    style={{ minWidth: 72, justifyContent: 'center' }}
                  >
                    {a.who}
                  </span>
                  <span style={{ flex: 1, color: 'var(--ink-soft)', fontSize: 14 }}>
                    {a.what}
                  </span>
                  {a.amount && (
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 16,
                        fontWeight: 500,
                        color: a.amount.startsWith('-') ? 'var(--ember-deep)' : 'var(--sage)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {a.amount}
                    </span>
                  )}
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--ink-faint)',
                      letterSpacing: '0.08em',
                      minWidth: 70,
                      textAlign: 'right',
                      textTransform: 'uppercase',
                    }}
                  >
                    {a.when}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal>
          <div
            className="card-feature card-ink"
            style={{
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 340,
              background: 'var(--ink)',
              color: 'var(--paper-mist)',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Warm radial accent */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: '-40%',
                background:
                  'radial-gradient(circle at 80% 20%, rgba(232,111,78,0.28), transparent 55%)',
                pointerEvents: 'none',
              }}
            />
            <div style={{ position: 'relative' }}>
              <span className="eyebrow" style={{ color: 'rgba(245,239,227,0.6)' }}>
                Now serving
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 28,
                  fontWeight: 440,
                  letterSpacing: '-0.02em',
                  marginTop: 10,
                  lineHeight: 1.1,
                }}
              >
                6 tables active.<br />
                <em style={{ color: 'var(--ember)', fontStyle: 'italic', fontWeight: 380 }}>
                  14 open tickets.
                </em>
              </h3>
              <p
                style={{
                  color: 'rgba(245,239,227,0.65)',
                  marginTop: 14,
                  fontSize: 14,
                  lineHeight: 1.55,
                  maxWidth: '34ch',
                }}
              >
                Your kitchen board shows everything in one glance — tap a ticket to move it forward.
              </p>
            </div>

            <div style={{ position: 'relative', marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <MagneticButton
                as={Link}
                to="/kitchen"
                className="btn btn-ember btn-arrow"
                strength={10}
              >
                Open the board
              </MagneticButton>
              <MagneticButton
                as={Link}
                to="/order"
                className="btn btn-ghost-ink"
                strength={6}
              >
                Orders
              </MagneticButton>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
