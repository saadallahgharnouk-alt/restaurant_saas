import React, { useState, useEffect } from 'react';
import { Reveal } from '../components/primitives';

/* ──────────────────────────────────────────────────────
   Kitchen Display System — Pending / Cooking / Ready,
   cream paper, ember accents, per-card live timers.
   ────────────────────────────────────────────────────── */

const STATUS_CONFIG = {
  Pending: {
    accent: 'var(--ember-deep)',
    label: 'NEW',
    badge: 'badge-ember',
    btnBg: 'var(--ember)',
    btnLabel: 'Start cooking',
    next: 'Preparing',
  },
  Preparing: {
    accent: '#D4932E',
    label: 'COOKING',
    badge: 'badge-soft',
    btnBg: 'var(--sage)',
    btnLabel: 'Mark ready',
    next: 'Ready',
  },
  Ready: {
    accent: 'var(--sage)',
    label: 'DONE',
    badge: 'badge-sage',
    btnBg: 'var(--ink)',
    btnLabel: 'Clear',
    next: null,
  },
};

const COLUMNS = ['Pending', 'Preparing', 'Ready'];

function useElapsed(startedAt) {
  const [secs, setSecs] = useState(Math.floor((Date.now() - startedAt) / 1000));
  useEffect(() => {
    const t = setInterval(
      () => setSecs(Math.floor((Date.now() - startedAt) / 1000)),
      1000
    );
    return () => clearInterval(t);
  }, [startedAt]);
  return secs;
}

function Timer({ startedAt, status }) {
  const secs = useElapsed(startedAt);
  const m = Math.floor(secs / 60),
    s = secs % 60;
  const urgent =
    (status === 'Pending' && m >= 5) || (status === 'Preparing' && m >= 10);
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        fontWeight: 500,
        color: urgent ? 'var(--ember-deep)' : 'var(--ink-faint)',
        letterSpacing: '0.04em',
        animation: urgent ? 'livePulse 1.2s ease-in-out infinite' : 'none',
      }}
    >
      {m}:{String(s).padStart(2, '0')}
    </span>
  );
}

function OrderCard({ order, colStatus, onAdvance, onClear }) {
  const cfg = STATUS_CONFIG[colStatus];
  const [exiting, setExiting] = useState(false);

  const handle = () => {
    setExiting(true);
    setTimeout(
      () =>
        colStatus === 'Ready' ? onClear(order.id) : onAdvance(order.id),
      280
    );
  };

  return (
    <div
      style={{
        background: 'var(--paper-mist)',
        border: '1px solid var(--rule)',
        borderLeft: `3px solid ${cfg.accent}`,
        borderRadius: 14,
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'translateX(16px) scale(0.97)' : 'translateX(0) scale(1)',
        transition: 'opacity 0.28s, transform 0.28s',
        animation: 'cardIn 0.32s var(--ease-out)',
        boxShadow: 'var(--lift-1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--ink)',
              letterSpacing: '0.03em',
            }}
          >
            #{order.id}
          </span>
          <span className={`badge ${cfg.badge}`} style={{ fontSize: 9 }}>
            {cfg.label}
          </span>
        </div>
        <Timer startedAt={order.startedAt} status={colStatus} />
      </div>

      <div>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 17,
            fontWeight: 500,
            color: 'var(--ink)',
            letterSpacing: '-0.015em',
            marginBottom: 6,
          }}
        >
          Table <em style={{ color: 'var(--ember-deep)', fontStyle: 'italic', fontWeight: 380 }}>{order.table}</em>
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {order.items.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: 'var(--ink-soft)',
                }}
              >
                {item.name}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--ink-faint)',
                }}
              >
                ×{item.qty}
              </span>
            </div>
          ))}
        </div>
      </div>

      {order.note && (
        <div
          style={{
            background: 'rgba(212,147,46,0.08)',
            border: '1px solid rgba(212,147,46,0.2)',
            borderRadius: 8,
            padding: '8px 12px',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: '#8B6818',
            letterSpacing: '0.02em',
          }}
        >
          ⚠ {order.note}
        </div>
      )}

      <button
        onClick={handle}
        className="btn"
        style={{
          background: cfg.btnBg,
          color: 'var(--paper-mist)',
          padding: '10px 0',
          fontSize: 13,
          fontWeight: 500,
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {cfg.btnLabel}
      </button>
    </div>
  );
}

const INITIAL_ORDERS = [
  { id: 3041, table: 4,  status: 'Pending',   startedAt: Date.now() - 120000, items: [{ name: 'Margherita Pizza', qty: 1 }, { name: 'Sparkling Water', qty: 2 }], note: 'Extra basil' },
  { id: 3042, table: 7,  status: 'Preparing', startedAt: Date.now() - 480000, items: [{ name: 'Spicy Tuna Roll', qty: 2 }] },
  { id: 3043, table: 2,  status: 'Pending',   startedAt: Date.now() - 60000,  items: [{ name: 'Tiramisu', qty: 1 }, { name: 'Americano', qty: 1 }] },
  { id: 3044, table: 11, status: 'Preparing', startedAt: Date.now() - 720000, items: [{ name: 'Garlic Bread', qty: 3 }], note: 'No garlic (allergy)' },
  { id: 3045, table: 9,  status: 'Ready',     startedAt: Date.now() - 900000, items: [{ name: 'Sparkling Water', qty: 4 }] },
  { id: 3046, table: 3,  status: 'Pending',   startedAt: Date.now() - 30000,  items: [{ name: 'Margherita Pizza', qty: 2 }, { name: 'Tiramisu', qty: 1 }] },
];

export default function KitchenBoard() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const advance = (id) =>
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const next = STATUS_CONFIG[o.status].next;
        return next ? { ...o, status: next } : o;
      })
    );

  const clear = (id) =>
    setOrders((prev) => prev.filter((o) => o.id !== id));

  const total   = orders.length;
  const pending = orders.filter((o) => o.status === 'Pending').length;
  const cooking = orders.filter((o) => o.status === 'Preparing').length;
  const ready   = orders.filter((o) => o.status === 'Ready').length;

  return (
    <div className="page">
      <Reveal as="div" className="page-header">
        <span className="eyebrow">Kitchen Display</span>
        <h1 className="page-title">
          Tonight&rsquo;s <em>flow</em>.
        </h1>
        <p className="page-sub">
          Real-time tracking &mdash; {total} active tickets. Tap the button to
          move a ticket forward.
        </p>
      </Reveal>

      <Reveal stagger className="grid-3 stagger" style={{ marginBottom: 28 }}>
        {[
          { label: 'Pending',  count: pending, color: 'var(--ember-deep)' },
          { label: 'Cooking',  count: cooking, color: '#D4932E' },
          { label: 'Ready',    count: ready,   color: 'var(--sage)' },
        ].map((s) => (
          <div key={s.label} className="stat">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color }}>
              {s.count}
            </div>
            <p
              style={{
                fontSize: 11,
                color: 'var(--ink-faint)',
                marginTop: 6,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.06em',
              }}
            >
              Orders in queue
            </p>
          </div>
        ))}
      </Reveal>

      <div className="grid-3" style={{ gap: 16, alignItems: 'start' }}>
        {COLUMNS.map((col) => {
          const cfg = STATUS_CONFIG[col];
          const colOrders = orders.filter((o) => o.status === col);
          return (
            <div
              key={col}
              className="card"
              style={{ padding: 0, overflow: 'hidden' }}
            >
              <div
                style={{
                  padding: '14px 22px',
                  borderBottom: '1px solid var(--rule)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--paper-soft)',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: cfg.accent,
                      display: 'block',
                      boxShadow: `0 0 10px ${cfg.accent}`,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: '0.14em',
                      color: cfg.accent,
                    }}
                  >
                    {col.toUpperCase()}
                  </span>
                </div>
                <span className={`badge ${cfg.badge}`}>
                  {colOrders.length}
                </span>
              </div>

              <div
                style={{
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {colOrders.length === 0 ? (
                  <div
                    style={{
                      padding: '44px 0',
                      textAlign: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--ink-faint)',
                      letterSpacing: '0.1em',
                      border: '1px dashed var(--rule)',
                      borderRadius: 12,
                    }}
                  >
                    NO ORDERS
                  </div>
                ) : (
                  colOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      colStatus={col}
                      onAdvance={advance}
                      onClear={clear}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
