import React, { useEffect, useState } from 'react';

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
  { name: 'Burgers',  orders: 120, color: '#6366f1' },
  { name: 'Pizza',    orders: 150, color: '#a855f7' },
  { name: 'Pasta',    orders: 90,  color: '#ec4899' },
  { name: 'Salads',   orders: 60,  color: '#22c55e' },
  { name: 'Desserts', orders: 45,  color: '#f59e0b' },
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
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const maxRev      = Math.max(...WEEK.map(d => d.rev));
  const totalOrders = CATEGORIES.reduce((n, c) => n + c.orders, 0);
  const maxItemRev  = Math.max(...TOP_ITEMS.map(i => i.revenue));

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <span className="page-tag">◎ Analytics</span>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Revenue, top items and category mix — last 7 days</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost">📄 Export CSV</button>
          <button className="btn btn-primary">📊 Download PDF</button>
        </div>
      </div>

      {/* ── KPI cards ─────────────────────────────── */}
      <div className="grid-4 stagger" style={{ marginBottom: 24 }}>
        <KPI label="Total Revenue"     value="$12,450" change="+12%"  up />
        <KPI label="Total Orders"      value="1,247"   change="+8%"   up />
        <KPI label="New Customers"     value="342"     change="+15%"  up />
        <KPI label="Avg. Order Value"  value="$9.98"   change="-3%"   down />
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 16, marginBottom: 16 }}>
        {/* ── Weekly revenue chart ──────────────────── */}
        <div className="card" style={{ animation: 'fadeUp 0.5s 0.15s var(--ease-out) both', padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-mid)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Weekly Revenue
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--text-hi)', marginTop: 2 }}>
                ${WEEK.reduce((s, d) => s + d.rev, 0).toLocaleString()}
              </p>
            </div>
            <span className="badge badge-accent">7d</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 200, paddingBottom: 6 }}>
            {WEEK.map((d, i) => {
              const h = (d.rev / maxRev) * 100;
              const peak = d.rev === maxRev;
              return (
                <div key={d.day} style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-mid)',
                    opacity: peak ? 1 : 0.6,
                  }}>
                    ${(d.rev / 1000).toFixed(1)}k
                  </span>
                  <div
                    title={`$${d.rev}`}
                    style={{
                      width: '100%',
                      borderRadius: '8px 8px 0 0',
                      background: peak
                        ? 'linear-gradient(180deg, #818cf8 0%, #4338ca 100%)'
                        : 'linear-gradient(180deg, rgba(99,102,241,0.55) 0%, rgba(99,102,241,0.25) 100%)',
                      height: mounted ? `${h}%` : '0%',
                      transition: `height 0.9s ${i * 0.06}s var(--ease-out)`,
                      boxShadow: peak ? '0 -6px 24px rgba(99,102,241,0.4)' : 'none',
                    }}
                  />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-mid)' }}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Top items ─────────────────────────────── */}
        <div className="card" style={{ animation: 'fadeUp 0.5s 0.25s var(--ease-out) both', padding: 24 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-mid)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            Top Items
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {TOP_ITEMS.map((item, i) => (
              <div key={item.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-hi)', fontWeight: 600 }}>
                    <span style={{ color: 'var(--text-mid)', fontFamily: 'var(--font-mono)', marginRight: 6 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {item.name}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', fontWeight: 600 }}>
                    ${item.revenue.toLocaleString()}
                  </span>
                </div>
                <div style={{ height: 4, background: 'var(--surface2)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: mounted ? `${(item.revenue / maxItemRev) * 100}%` : '0%',
                    background: 'linear-gradient(90deg, #818cf8, #4338ca)',
                    borderRadius: 99,
                    transition: `width 0.9s ${i * 0.07}s var(--ease-out)`,
                  }} />
                </div>
                <p style={{ fontSize: 10, color: 'var(--text-mid)', marginTop: 4 }}>{item.orders} orders</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Category mix ─────────────────────────── */}
      <div className="card" style={{ animation: 'fadeUp 0.5s 0.35s var(--ease-out) both', padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-mid)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Category Mix
          </p>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-mid)' }}>
            {totalOrders} orders
          </span>
        </div>

        {/* Segmented bar */}
        <div style={{
          display: 'flex', gap: 2, height: 14, borderRadius: 99, overflow: 'hidden',
          background: 'var(--surface2)', marginBottom: 20,
        }}>
          {CATEGORIES.map((c, i) => (
            <div
              key={c.name}
              title={`${c.name}: ${c.orders}`}
              style={{
                flexGrow: mounted ? c.orders : 0,
                background: c.color,
                transition: `flex-grow 1s ${i * 0.08}s var(--ease-out)`,
              }}
            />
          ))}
        </div>

        <div className="grid-4" style={{ gap: 12 }}>
          {CATEGORIES.map(c => (
            <div key={c.name} className="card" style={{
              padding: '14px 16px', background: 'var(--surface2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 3, background: c.color, display: 'block' }} />
                <span style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>{c.name}</span>
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--text-hi)' }}>
                {c.orders}
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-mid)', marginTop: 2 }}>
                {((c.orders / totalOrders) * 100).toFixed(0)}% of orders
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, change, up, down }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      <p className={`stat-change ${up ? 'up' : down ? 'down' : ''}`}>
        {up ? '↑ ' : down ? '↓ ' : ''}{change}
      </p>
    </div>
  );
}
