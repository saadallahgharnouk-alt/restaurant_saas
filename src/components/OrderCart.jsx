import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const SEED = [
  { id: 1, name: 'Classic Burger',      price: 12.99, qty: 2, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=60' },
  { id: 5, name: 'Spaghetti Carbonara', price: 13.99, qty: 1, image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=200&q=60' },
  { id: 6, name: 'Chocolate Fondant',   price: 7.99,  qty: 1, image: 'https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?auto=format&fit=crop&w=200&q=60' },
];

const PROMOS = {
  SAVE10:  10,
  SAVE20:  20,
  WELCOME: 15,
};

export default function OrderCart() {
  const [cart, setCart]             = useState(SEED);
  const [promoInput, setPromoInput] = useState('');
  const [promoPct, setPromoPct]     = useState(0);
  const [promoError, setPromoError] = useState('');
  const [placed, setPlaced]         = useState(null);

  const { subtotal, tax, discount, total } = useMemo(() => {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const tax = subtotal * 0.1;
    const discount = subtotal * (promoPct / 100);
    const total = Math.max(0, subtotal + tax - discount);
    return { subtotal, tax, discount, total };
  }, [cart, promoPct]);

  const updateQty = (id, delta) =>
    setCart(prev =>
      prev
        .map(i => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter(i => i.qty > 0)
    );

  const removeItem = id => setCart(prev => prev.filter(i => i.id !== id));

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) { setPromoError('Enter a promo code first.'); return; }
    if (PROMOS[code]) {
      setPromoPct(PROMOS[code]);
      setPromoError('');
    } else {
      setPromoPct(0);
      setPromoError(`"${code}" is not a valid promo code.`);
    }
  };

  const clearPromo = () => { setPromoPct(0); setPromoInput(''); setPromoError(''); };

  const placeOrder = () => {
    if (cart.length === 0) return;
    setPlaced({ id: Math.floor(Math.random() * 9000) + 1000, total });
    setCart([]);
    clearPromo();
  };

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <span className="page-tag">⬢ Orders</span>
          <h1 className="page-title">Your Order</h1>
          <p className="page-sub">Review items, apply a promo code, then send to the kitchen.</p>
        </div>
        <Link to="/menu" className="btn btn-ghost">← Back to menu</Link>
      </div>

      {placed && (
        <div className="card" style={{
          marginBottom: 24,
          background: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.25)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: 12, flexWrap: 'wrap',
        }}>
          <div>
            <span className="badge badge-green">ORDER PLACED</span>
            <p style={{ marginTop: 8, color: 'var(--text-hi)', fontWeight: 600 }}>
              Order #{placed.id} sent to the kitchen — total ${placed.total.toFixed(2)}
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setPlaced(null)}>Dismiss</button>
        </div>
      )}

      <div className="grid-2" style={{ gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 20, alignItems: 'start' }}>
        {/* ── Cart items ───────────────────────────── */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-hi)' }}>
              Items ({cart.reduce((n, i) => n + i.qty, 0)})
            </h2>
            {cart.length > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={() => setCart([])}>Clear all</button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="empty-state">
              <span style={{ fontSize: 28 }}>⬢</span>
              <span>Your cart is empty.</span>
              <Link to="/menu" className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>
                Browse the menu
              </Link>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {cart.map((item, idx) => (
                <li
                  key={item.id}
                  style={{
                    display: 'flex', gap: 14, alignItems: 'center',
                    padding: '16px 20px',
                    borderBottom: idx === cart.length - 1 ? 'none' : '1px solid var(--border)',
                    animation: `cardIn 0.35s ${idx * 0.05}s var(--ease-out) both`,
                  }}
                >
                  <div style={{
                    width: 64, height: 64, borderRadius: 10, overflow: 'hidden',
                    background: 'var(--surface2)', flexShrink: 0,
                    border: '1px solid var(--border)',
                  }}>
                    {item.image && (
                      <img src={item.image} alt={item.name}
                           style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 14, fontWeight: 700, color: 'var(--text-hi)',
                      letterSpacing: '-0.2px',
                    }}>{item.name}</p>
                    <p style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11, color: 'var(--text-mid)', marginTop: 2,
                    }}>${item.price.toFixed(2)} × {item.qty}</p>
                  </div>

                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    borderRadius: 99,
                    padding: '4px 6px',
                  }}>
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      aria-label="Decrease quantity"
                      style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: 'transparent', border: 'none',
                        color: 'var(--text)', cursor: 'pointer', fontSize: 14,
                      }}
                    >−</button>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 12,
                      color: 'var(--text-hi)', minWidth: 18, textAlign: 'center',
                    }}>{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, +1)}
                      aria-label="Increase quantity"
                      style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: 'var(--accent)', border: 'none',
                        color: '#fff', cursor: 'pointer', fontSize: 14,
                      }}
                    >+</button>
                  </div>

                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 15, fontWeight: 700, color: 'var(--text-hi)',
                    minWidth: 70, textAlign: 'right',
                  }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                    style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      color: 'var(--red)', cursor: 'pointer', fontSize: 14,
                    }}
                  >×</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Summary ─────────────────────────────── */}
        <aside className="card" style={{
          position: 'sticky', top: 84,
          padding: 24, display: 'flex', flexDirection: 'column', gap: 18,
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-hi)' }}>
            Summary
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
            <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
            <Row label="Tax (10%)" value={`$${tax.toFixed(2)}`} />
            {discount > 0 && (
              <Row
                label={`Discount (${promoPct}%)`}
                value={`-$${discount.toFixed(2)}`}
                valueColor="var(--green)"
              />
            )}
            <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />
            <Row
              label="Total"
              value={`$${total.toFixed(2)}`}
              bold
            />
          </div>

          {/* Promo */}
          <div>
            <label style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--text-mid)', letterSpacing: '0.1em',
              display: 'block', marginBottom: 6, textTransform: 'uppercase',
            }}>Promo code</label>

            <div style={{ display: 'flex', gap: 6 }}>
              <input
                className="input"
                placeholder="e.g. SAVE10"
                value={promoInput}
                onChange={e => setPromoInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applyPromo()}
                style={{ flex: 1 }}
              />
              {promoPct > 0 ? (
                <button className="btn btn-ghost btn-sm" onClick={clearPromo}>✕</button>
              ) : (
                <button className="btn btn-primary btn-sm" onClick={applyPromo}>Apply</button>
              )}
            </div>
            {promoError && (
              <p style={{ color: 'var(--red)', fontSize: 11, marginTop: 6 }}>{promoError}</p>
            )}
            {promoPct > 0 && (
              <p style={{ color: 'var(--green)', fontSize: 11, marginTop: 6 }}>
                ✓ {promoInput.toUpperCase()} applied — {promoPct}% off
              </p>
            )}
            <p style={{ color: 'var(--text-mid)', fontSize: 10, marginTop: 6 }}>
              Try <span style={{ fontFamily: 'var(--font-mono)' }}>SAVE10</span>,{' '}
              <span style={{ fontFamily: 'var(--font-mono)' }}>SAVE20</span>,{' '}
              <span style={{ fontFamily: 'var(--font-mono)' }}>WELCOME</span>
            </p>
          </div>

          <button
            onClick={placeOrder}
            disabled={cart.length === 0}
            className="btn btn-primary"
            style={{
              padding: '14px 16px',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.08em',
              opacity: cart.length === 0 ? 0.5 : 1,
              cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            CHECKOUT · ${total.toFixed(2)}
          </button>

          <p style={{
            color: 'var(--text-mid)', fontSize: 10, textAlign: 'center',
            lineHeight: 1.5,
          }}>
            Secure checkout · Orders route straight to the kitchen display.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, valueColor, bold = false }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{
        color: 'var(--text-mid)',
        fontWeight: bold ? 700 : 400,
        fontSize: bold ? 14 : 13,
      }}>{label}</span>
      <span style={{
        color: valueColor || 'var(--text-hi)',
        fontWeight: bold ? 800 : 600,
        fontSize: bold ? 18 : 13,
        fontFamily: bold ? 'var(--font-display)' : 'var(--font-body)',
      }}>{value}</span>
    </div>
  );
}
