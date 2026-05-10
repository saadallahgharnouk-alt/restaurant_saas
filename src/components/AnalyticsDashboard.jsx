import React, { useEffect, useState } from 'react';
import {
  Reveal,
  TiltCard,
  AnimatedNumber,
} from './primitives';

/* ──────────────────────────────────────────────────────
   Analytics — warm editorial report.
   Custom CSS bars (no chart.js), ember palette accents.
   ────────────────────────────────────────────────────── */

const WEEK = [
  { day: 'Mon', rev: 1200 },
  { day: 'Tue', rev: 1900 },
  { day: 'Wed', rev: 1500 },
  { day: 'Thu', rev: 2200 },
  { day: 'Fri', rev: 2800 },
  { day: 'Sat', rev: 3100 },
  { day: 'Sun', rev: 2500 },
];

const CATEGORIES = [
  { name: 'Burgers',  orders: 120, color: '#E86F4E' },
  { name: 'Pizza',    orders: 150, color: '#B13D2A' },
  { name: 'Pasta',    orders: 90,  color: '#D4932E' },
  { name: 'Salads',   orders: 60,  color: '#6B8E5A' },
  { name: 'Desserts', orders: 45,  color: '#6B3D5C' },
];

const TOP_ITEMS = [
  { name: 'Pepperoni Pizza',      orders: 248, revenue: 3720 },
  { name: 'Classic Burger',       orders: 201, revenue: 2613 },
  { name: 'Spaghetti Carbonara',  orders: 187, revenue: 2614 },
  { name: 'Caesar Salad',         orders: 156, revenue: 1559 },
  { name: 'Chocolate Fondant',    orders: 134, revenue: 1071 },
];

export default function AnalyticsDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(t);
  }, []);

  const maxRev      = Math.max(...WEEK.map((d) => d.rev));
  const totalOrders = CATEGORIES.reduce((n, c) => n + c.orders, 0);
  const maxItemRev  = Math.max(...TOP_ITEMS.map((i) => i.revenue));

  return (
    <div className="page">
      <Reveal as="div" className="page-header">
        <span className="eyebrow">Analytics</span>
        <h1 className="page-title">
          Numbers that<br />
          <em>read like a story</em>.
        </h1>
        <p className="page-sub">
          Revenue, top items and category mix — the last seven days, quietly.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button className="btn btn-ghost">Export CSV</button>
          <button className="btn btn-ember btn-arrow">Download PDF</button>
        </div>
      </Reveal>

      {/* ── KPI cards ─────────────────────────────── */}
      <Reveal stagger className="grid-4 stagger" style={{ marginBottom: 28 }}>
        <KPI label="Total revenue"    value={12450} prefix="$" delta="+12%" up />
        <KPI label="Total orders"     value={1247}              delta="+8%"  up />
        <KPI label="New customers"    value={342}               delta="+15%" up />
        <KPI label="Avg. order value" value={9.98}  prefix="$" decimals={2} delta="-3%" down />
      </Reveal>

      <div
        className="grid-2"
        style={{
          gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)',
          gap: 16,
          marginBottom: 16,
        }}
      >
        {/* ── Weekly revenue chart ──────────────── */}
        <Reveal>
          <TiltCard className="card" max={3} glare={false}>
            <div style={{ padding: 4 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 22,
                }}
              >
                <div>
                  <span className="eyebrow">Weekly revenue</span>
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 34,
                      fontWeight: 500,
                      color: 'var(--ink)',
                      marginTop: 6,
                      letterSpacing: '-0.025em',
                    }}
                  >
                    $
                    <AnimatedNumber
                      value={WEEK.reduce((s, d) => s + d.rev, 0)}
                    />
                  </p>
                </div>
                <span className="badge badge-ember">7 days</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 10,
                  height: 220,
                  paddingBottom: 6,
                }}
              >
                {WEEK.map((d, i) => {
                  const h = (d.rev / maxRev) * 100;
                  const peak = d.rev === maxRev;
                  return (
                    <div
                      key={d.day}
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        height: '100%',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 10,
                          color: 'var(--ink-faint)',
                          opacity: peak ? 1 : 0.7,
                        }}
                      >
                        ${(d.rev / 1000).toFixed(1)}k
                      </span>
                      <div
                        title={`$${d.rev}`}
                        style={{
                          width: '100%',
                          borderRadius: '10px 10px 0 0',
                          background: peak
                            ? 'linear-gradient(180deg, #E86F4E 0%, #B13D2A 100%)'
                            : 'linear-gradient(180deg, rgba(232,111,78,0.55) 0%, rgba(232,111,78,0.22) 100%)',
                          height: mounted ? `${h}%` : '0%',
                          transition: `height 0.95s ${i * 0.07}s var(--ease-out)`,
                          boxShadow: peak ? 'var(--glow-ember)' : 'none',
                        }}
                      />
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                          color: 'var(--ink-faint)',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </TiltCard>
        </Reveal>

        {/* ── Top items ─────────────────────────── */}
        <Reveal>
          <div className="card" style={{ padding: 24 }}>
            <span className="eyebrow">Top items</span>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 22,
                fontWeight: 440,
                letterSpacing: '-0.02em',
                color: 'var(--ink)',
                margin: '6px 0 20px',
              }}
            >
              What <em style={{ color: 'var(--ember-deep)', fontStyle: 'italic', fontWeight: 380 }}>sold</em>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {TOP_ITEMS.map((item, i) => (
                <div key={item.name}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        color: 'var(--ink)',
                        fontWeight: 500,
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      <span
                        style={{
                          color: 'var(--ink-faint)',
                          fontFamily: 'var(--font-mono)',
                          marginRight: 8,
                          fontWeight: 400,
                          fontSize: 11,
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {item.name}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        color: 'var(--ember-deep)',
                        fontWeight: 500,
                      }}
                    >
                      ${item.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 5,
                      background: 'var(--paper-soft)',
                      borderRadius: 99,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: mounted
                          ? `${(item.revenue / maxItemRev) * 100}%`
                          : '0%',
                        background:
                          'linear-gradient(90deg, #E86F4E, #B13D2A)',
                        borderRadius: 99,
                        transition: `width 1s ${i * 0.08}s var(--ease-out)`,
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: 10,
                      color: 'var(--ink-faint)',
                      marginTop: 6,
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {item.orders} orders
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── Category mix ───────────────────────── */}
      <Reveal>
        <div className="card" style={{ padding: 28 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 22,
            }}
          >
            <div>
              <span className="eyebrow">Category mix</span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 24,
                  fontWeight: 440,
                  letterSpacing: '-0.02em',
                  color: 'var(--ink)',
                  marginTop: 6,
                }}
              >
                How tonight <em style={{ color: 'var(--ember-deep)', fontStyle: 'italic', fontWeight: 380 }}>splits</em>
              </h3>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--ink-mid)',
              }}
            >
              {totalOrders} orders
            </span>
          </div>

          {/* Segmented ribbon */}
          <div
            style={{
              display: 'flex',
              gap: 3,
              height: 18,
              borderRadius: 99,
              overflow: 'hidden',
              background: 'var(--paper-soft)',
              marginBottom: 24,
              border: '1px solid var(--rule)',
            }}
          >
            {CATEGORIES.map((c, i) => (
              <div
                key={c.name}
                title={`${c.name}: ${c.orders}`}
                style={{
                  flexGrow: mounted ? c.orders : 0,
                  background: c.color,
                  transition: `flex-grow 1.1s ${i * 0.08}s var(--ease-out)`,
                }}
              />
            ))}
          </div>

          <div className="grid-4" style={{ gap: 12 }}>
            {CATEGORIES.map((c) => (
              <div
                key={c.name}
                style={{
                  padding: '16px 18px',
                  background: 'var(--paper-soft)',
                  border: '1px solid var(--rule)',
                  borderRadius: 14,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 3,
                      background: c.color,
                      display: 'block',
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      color: 'var(--ink-soft)',
                      fontWeight: 500,
                    }}
                  >
                    {c.name}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 26,
                    fontWeight: 500,
                    color: 'var(--ink)',
                    letterSpacing: '-0.025em',
                  }}
                >
                  {c.orders}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'var(--ink-faint)',
                    marginTop: 4,
                    letterSpacing: '0.06em',
                  }}
                >
                  {((c.orders / totalOrders) * 100).toFixed(0)}% of orders
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function KPI({ label, value, prefix, suffix, decimals, delta, up, down }) {
  return (
    <TiltCard as="div" className="stat" max={5}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        <AnimatedNumber
          value={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals || 0}
        />
      </div>
      <div className={`stat-delta ${up ? 'up' : down ? 'down' : ''}`}>
        {up ? '↑' : down ? '↓' : '→'} {delta}
        <span style={{ color: 'var(--ink-faint)', fontWeight: 400, marginLeft: 6 }}>
          vs last week
        </span>
      </div>
    </TiltCard>
  );
}
