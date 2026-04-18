import React, { useState, useEffect } from 'react';

const STATUS_CONFIG = {
  Pending: {
    accent: 'var(--red)', dim: 'rgba(239,68,68,0.1)', label: 'NEW',
    btnBg: 'var(--accent)', btnLabel: 'START COOKING', next: 'Preparing',
  },
  Preparing: {
    accent: 'var(--amber)', dim: 'rgba(245,158,11,0.08)', label: 'COOKING',
    btnBg: 'var(--green)', btnLabel: 'MARK READY', next: 'Ready',
  },
  Ready: {
    accent: 'var(--green)', dim: 'rgba(34,197,94,0.06)', label: 'DONE',
    btnBg: 'var(--surface2)', btnLabel: 'CLEAR', next: null,
  },
};

const COLUMNS = ['Pending', 'Preparing', 'Ready'];

function useElapsed(startedAt) {
  const [secs, setSecs] = useState(Math.floor((Date.now() - startedAt) / 1000));
  useEffect(() => {
    const t = setInterval(() => setSecs(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(t);
  }, [startedAt]);
  return secs;
}

function Timer({ startedAt, status }) {
  const secs = useElapsed(startedAt);
  const m = Math.floor(secs / 60), s = secs % 60;
  const urgent = (status === 'Pending' && m >= 5) || (status === 'Preparing' && m >= 10);
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
      color: urgent ? 'var(--red)' : 'var(--text-mid)',
      animation: urgent ? 'urgentBlink 1.4s ease-in-out infinite' : 'none',
    }}>
      {m}:{String(s).padStart(2, '0')}
    </span>
  );
}

function OrderCard({ order, colStatus, onAdvance, onClear }) {
  const cfg = STATUS_CONFIG[colStatus];
  const [exiting, setExiting] = useState(false);

  const handle = () => {
    setExiting(true);
    setTimeout(() => colStatus === 'Ready' ? onClear(order.id) : onAdvance(order.id), 300);
  };

  return (
    <div className="card" style={{
      background: 'var(--surface2)',
      borderLeft: `3px solid ${cfg.accent}`,
      padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 10,
      opacity: exiting ? 0 : 1,
      transform: exiting ? 'translateX(16px) scale(0.97)' : 'translateX(0) scale(1)',
      transition: 'opacity 0.3s, transform 0.3s',
      animation: 'cardIn 0.3s cubic-bezier(0.23,1,0.32,1)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--text-hi)' }}>
            #{order.id}
          </span>
          <span className={`badge ${colStatus === 'Pending' ? 'badge-red' : colStatus === 'Preparing' ? 'badge-amber' : 'badge-green'}`} style={{ fontSize: 9 }}>
            {cfg.label}
          </span>
        </div>
        <Timer startedAt={order.startedAt} status={colStatus} />
      </div>

      <div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text-hi)', marginBottom: 4 }}>
          Table {order.table}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {order.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'var(--text)' }}>{item.name}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-mid)' }}>×{item.qty}</span>
            </div>
          ))}
        </div>
      </div>

      {order.note && (
        <div style={{
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)',
          borderRadius: 6, padding: '6px 10px',
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)',
        }}>
          ⚠ {order.note}
        </div>
      )}

      <button onClick={handle} className="btn" style={{
        background: cfg.btnBg, color: '#fff',
        padding: '9px 0',
        fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
        width: '100%',
      }}>
        {cfg.btnLabel}
      </button>
    </div>
  );
}

const INITIAL_ORDERS = [
  { id: 3041, table: 4,  status: 'Pending',   startedAt: Date.now() - 120000, items: [{ name: 'Margherita Pizza', qty: 1 }, { name: 'Sparkling Water', qty: 2 }], note: 'Extra basil' },
  { id: 3042, table: 7,  status: 'Preparing',  startedAt: Date.now() - 480000, items: [{ name: 'Spicy Tuna Roll', qty: 2 }] },
  { id: 3043, table: 2,  status: 'Pending',   startedAt: Date.now() - 60000,  items: [{ name: 'Tiramisu', qty: 1 }, { name: 'Americano', qty: 1 }] },
  { id: 3044, table: 11, status: 'Preparing',  startedAt: Date.now() - 720000, items: [{ name: 'Garlic Bread', qty: 3 }], note: 'No garlic (allergy)' },
  { id: 3045, table: 9,  status: 'Ready',     startedAt: Date.now() - 900000, items: [{ name: 'Sparkling Water', qty: 4 }] },
  { id: 3046, table: 3,  status: 'Pending',   startedAt: Date.now() - 30000,  items: [{ name: 'Margherita Pizza', qty: 2 }, { name: 'Tiramisu', qty: 1 }] },
];

export default function KitchenBoard() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const advance = id => setOrders(prev => prev.map(o => {
    if (o.id !== id) return o;
    const next = STATUS_CONFIG[o.status].next;
    return next ? { ...o, status: next } : o;
  }));

  const clear = id => setOrders(prev => prev.filter(o => o.id !== id));

  const total    = orders.length;
  const pending  = orders.filter(o => o.status === 'Pending').length;
  const cooking  = orders.filter(o => o.status === 'Preparing').length;
  const ready    = orders.filter(o => o.status === 'Ready').length;

  return (
    <div className="page">
      <div className="page-header">
        <span className="page-tag">🍳 Kitchen</span>
        <h1 className="page-title">Kitchen Display System</h1>
        <p className="page-sub">Real-time order tracking · {total} active orders</p>
      </div>

      <div className="grid-3 stagger" style={{ marginBottom: 24 }}>
        {[
          { label: 'Pending',   count: pending, color: 'var(--red)' },
          { label: 'Cooking',   count: cooking, color: 'var(--amber)' },
          { label: 'Ready',     count: ready,   color: 'var(--green)' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <p className="stat-label">{s.label}</p>
            <p className="stat-value" style={{ color: s.color }}>{s.count}</p>
            <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 4 }}>Orders in queue</p>
          </div>
        ))}
      </div>

      <div className="grid-3" style={{ gap: 16, alignItems: 'start' }}>
        {COLUMNS.map((col, ci) => {
          const cfg = STATUS_CONFIG[col];
          const colOrders = orders.filter(o => o.status === col);
          return (
            <div key={col} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                padding: '14px 20px',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'var(--surface2)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.accent, display: 'block', boxShadow: `0 0 8px ${cfg.accent}` }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: cfg.accent }}>
                    {col.toUpperCase()}
                  </span>
                </div>
                <span className={`badge ${col === 'Pending' ? 'badge-red' : col === 'Preparing' ? 'badge-amber' : 'badge-green'}`}>
                  {colOrders.length}
                </span>
              </div>

              <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {colOrders.length === 0 ? (
                  <div style={{
                    padding: '40px 0', textAlign: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-mid)', letterSpacing: '0.06em',
                    border: '1px dashed var(--border)', borderRadius: 10,
                  }}>
                    NO ORDERS
                  </div>
                ) : colOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    colStatus={col}
                    onAdvance={advance}
                    onClear={clear}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
