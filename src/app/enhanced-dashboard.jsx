import React from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '▦',
    title: 'QR Code Menus',
    desc: 'Print a QR card per table. Guests scan, the menu opens on their phone instantly.',
    cta: 'Generate QR',
    href: '/qr',
  },
  {
    icon: '⬢',
    title: 'Order Management',
    desc: 'Live cart, promo codes, tax + tip — from the table to the kitchen in one tap.',
    cta: 'See Orders',
    href: '/order',
  },
  {
    icon: '◎',
    title: 'Real-time Analytics',
    desc: 'Revenue, peak hours and top items, updated live so you know where the night is going.',
    cta: 'Open Analytics',
    href: '/analytics',
  },
  {
    icon: '✦',
    title: 'Kitchen Display',
    desc: 'A single board for pending, cooking and ready tickets — no more paper chits.',
    cta: 'Open Kitchen',
    href: '/kitchen',
  },
];

const STATS = [
  { label: 'Active venues',  value: '6',      sub: '+2 this quarter' },
  { label: 'Orders / month', value: '6,423',  sub: '↑ 12.4% vs last month' },
  { label: 'Avg ticket',     value: '$28.40', sub: 'Across all venues' },
  { label: 'Uptime',         value: '99.9%',  sub: 'Last 30 days' },
];

export default function EnhancedDashboard() {
  return (
    <div className="page">
      {/* Hero */}
      <section className="hero-banner">
        <span className="hero-tag">● RestauHub · Welcome</span>
        <h1 className="hero-title">
          Run your restaurant<br />
          <span style={{
            background: 'linear-gradient(135deg, #818cf8, #4338ca)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}>like a SaaS</span>
        </h1>
        <p className="hero-sub">
          QR menus, live orders, kitchen board and analytics — in one light,
          fast dashboard your whole team actually wants to use.
        </p>

        <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
          <Link to="/qr" className="btn btn-primary">▦ Generate QR Menu</Link>
          <Link to="/menu" className="btn btn-ghost">◍ Manage Menu</Link>
          <Link to="/analytics" className="btn btn-ghost">◎ View Analytics</Link>
        </div>
      </section>

      {/* Stats */}
      <div className="grid-4 stagger" style={{ marginBottom: 36 }}>
        {STATS.map((s, i) => (
          <div className="stat-card" key={i}>
            <p className="stat-label">{s.label}</p>
            <p className="stat-value">{s.value}</p>
            <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 8 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div style={{ marginBottom: 20 }}>
        <span className="page-tag">◈ Capabilities</span>
        <h2 className="page-title" style={{ fontSize: 24, marginTop: 4 }}>Everything you need tonight</h2>
      </div>

      <div className="grid-2 stagger" style={{ marginBottom: 36 }}>
        {FEATURES.map((f, i) => (
          <Link
            key={i}
            to={f.href}
            className="card card-glow"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'var(--accent-dim)',
              border: '1px solid rgba(99,102,241,0.25)',
              color: '#818cf8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontFamily: 'var(--font-display)',
            }}>{f.icon}</div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--text-hi)',
              letterSpacing: '-0.3px',
            }}>{f.title}</h3>
            <p style={{ color: 'var(--text-mid)', fontSize: 13, lineHeight: 1.65 }}>{f.desc}</p>
            <div style={{
              marginTop: 'auto',
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-mono)', fontSize: 11, color: '#818cf8',
              letterSpacing: '0.08em',
            }}>
              {f.cta.toUpperCase()} →
            </div>
          </Link>
        ))}
      </div>

      {/* Call to action */}
      <div className="card" style={{
        padding: '40px 32px',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.14) 0%, rgba(34,197,94,0.08) 100%)',
        border: '1px solid rgba(99,102,241,0.25)',
        display: 'flex', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <div style={{ maxWidth: 520 }}>
          <span className="badge badge-accent" style={{ marginBottom: 10 }}>NEW</span>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22, fontWeight: 800, color: 'var(--text-hi)',
            letterSpacing: '-0.5px', marginBottom: 8,
          }}>
            Turn any table into an ordering station
          </h3>
          <p style={{ color: 'var(--text)', fontSize: 13, lineHeight: 1.65 }}>
            Generate a table-aware QR code, print it, and guests land on a branded
            mobile menu — no app install, no friction. Their order goes straight to
            the kitchen board.
          </p>
        </div>
        <Link to="/qr" className="btn btn-primary" style={{ padding: '12px 22px' }}>
          ▦ Create QR Menu
        </Link>
      </div>
    </div>
  );
}
