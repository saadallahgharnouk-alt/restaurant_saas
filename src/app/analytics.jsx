import React, { useState, useEffect } from 'react';

const WEEKLY = [
  { day: 'Mon', amount: 850,  pct: 30 },
  { day: 'Tue', amount: 920,  pct: 33 },
  { day: 'Wed', amount: 1100, pct: 39 },
  { day: 'Thu', amount: 1450, pct: 52 },
  { day: 'Fri', amount: 2100, pct: 75 },
  { day: 'Sat', amount: 2800, pct: 100 },
  { day: 'Sun', amount: 2400, pct: 86 },
];

const PEAK = [
  { time: '7:00 PM – 8:00 PM', orders: 42, heat: 1.0 },
  { time: '6:00 PM – 7:00 PM', orders: 38, heat: 0.9 },
  { time: '8:00 PM – 9:00 PM', orders: 31, heat: 0.74 },
  { time: '12:00 PM – 1:00 PM', orders: 28, heat: 0.67 },
  { time: '1:00 PM – 2:00 PM', orders: 19, heat: 0.45 },
];

export default function Analytics() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="page-tag">◉ Reports</span>
          <h1 className="page-title">Analytics</h1>
          <p className="page-sub">Revenue, costs, and peak hour insights — last 7 days</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost">📄 Export CSV</button>
          <button className="btn btn-primary">📊 Download PDF</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-3 stagger" style={{ marginBottom: 24 }}>
        {[
          { label: 'Gross Revenue (7d)', value: '$11,620', change: '↑ +14.5%', sub: 'from last week', up: true },
          { label: 'Labor Cost %',        value: '24.2%',  change: '↓ −1.2%',  sub: 'from last week (Good!)', up: true },
          { label: 'Peak Hour',           value: '7:00 PM', change: '42 orders/hr', sub: 'avg this week', up: null },
        ].map((s, i) => (
          <div className="stat-card" key={i} style={{ animationDelay: `${i*0.1}s` }}>
            <p className="stat-label">{s.label}</p>
            <p className="stat-value" style={{ fontSize: 24 }}>{s.value}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <span className={`badge ${s.up === true ? 'badge-green' : s.up === false ? 'badge-red' : 'badge-accent'}`}>
                {s.change}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-mid)' }}>{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
        {/* Bar Chart */}
        <div className="card" style={{ animation: 'fadeUp 0.5s 0.2s var(--ease-out) both' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-mid)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>Daily Revenue</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180, paddingBottom: 4 }}>
            {WEEKLY.map((d, i) => (
              <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-mid)' }}>
                  ${(d.amount/1000).toFixed(1)}k
                </span>
                <div
                  title={`$${d.amount}`}
                  style={{
                    width: '100%',
                    borderRadius: '6px 6px 0 0',
                    background: d.pct === 100
                      ? 'linear-gradient(180deg, #818cf8 0%, #6366f1 100%)'
                      : 'linear-gradient(180deg, rgba(99,102,241,0.6) 0%, rgba(99,102,241,0.35) 100%)',
                    height: mounted ? `${d.pct}%` : '0%',
                    transition: `height 0.8s ${i*0.07}s cubic-bezier(0.23,1,0.32,1)`,
                    cursor: 'pointer',
                    boxShadow: d.pct === 100 ? '0 -4px 20px rgba(99,102,241,0.4)' : 'none',
                    position: 'relative',
                  }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-mid)' }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours */}
        <div className="card" style={{ animation: 'fadeUp 0.5s 0.3s var(--ease-out) both' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-mid)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>Busiest Hours</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PEAK.map((p, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--text)' }}>{p.time}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-hi)', fontWeight: 600 }}>{p.orders} orders</span>
                </div>
                <div style={{ height: 6, background: 'var(--surface2)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: mounted ? `${p.heat * 100}%` : '0%',
                    background: p.heat > 0.8
                      ? 'linear-gradient(90deg, var(--red), #f87171)'
                      : p.heat > 0.6
                      ? 'linear-gradient(90deg, var(--amber), #fbbf24)'
                      : 'linear-gradient(90deg, var(--accent), #818cf8)',
                    borderRadius: 99,
                    transition: `width 0.9s ${i*0.1}s cubic-bezier(0.23,1,0.32,1)`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom table */}
      <div style={{ animation: 'fadeUp 0.5s 0.4s var(--ease-out) both' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-hi)' }}>Weekly Breakdown</p>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', background: 'var(--surface2)' }}>
                <th style={{ padding: '12px 20px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-mid)' }}>DAY</th>
                <th style={{ padding: '12px 20px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-mid)' }}>REVENUE</th>
                <th style={{ padding: '12px 20px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-mid)' }}>ORDERS</th>
                <th style={{ padding: '12px 20px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-mid)' }}>AVG TICKET</th>
                <th style={{ padding: '12px 20px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-mid)' }}>VS PRIOR WEEK</th>
              </tr>
            </thead>
            <tbody>
              {WEEKLY.map((d, i) => {
                const orders = Math.round(d.amount / 26);
                const changes = ['+12%', '+8%', '+15%', '+22%', '+31%', '+18%', '+9%'];
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 20px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-hi)' }}>{d.day}</td>
                    <td style={{ padding: '12px 20px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-hi)' }}>${d.amount.toLocaleString()}</td>
                    <td style={{ padding: '12px 20px', color: 'var(--text)' }}>{orders}</td>
                    <td style={{ padding: '12px 20px', color: 'var(--text)' }}>${(d.amount / orders).toFixed(2)}</td>
                    <td style={{ padding: '12px 20px' }}><span className="badge badge-green">{changes[i]}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
