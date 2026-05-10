import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal, MagneticButton } from './primitives';

const SEED = [
  { id: 1, name: 'Classic Burger',      price: 12.99, qty: 2, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=60' },
  { id: 5, name: 'Spaghetti Carbonara', price: 13.99, qty: 1, image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=200&q=60' },
  { id: 6, name: 'Chocolate Fondant',   price: 7.99,  qty: 1, image: 'https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?auto=format&fit=crop&w=200&q=60' },
];

const PROMOS = { SAVE10: 10, SAVE20: 20, WELCOME: 15 };

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
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );

  const removeItem = (id) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoError('Enter a promo code first.');
      return;
    }
    if (PROMOS[code]) {
      setPromoPct(PROMOS[code]);
      setPromoError('');
    } else {
      setPromoPct(0);
      setPromoError(`"${code}" is not a valid promo code.`);
    }
  };

  const clearPromo = () => {
    setPromoPct(0);
    setPromoInput('');
    setPromoError('');
  };

  const placeOrder = () => {
    if (cart.length === 0) return;
    setPlaced({ id: Math.floor(Math.random() * 9000) + 1000, total });
    setCart([]);
    clearPromo();
  };

  return (
    <div className="page">
      <Reveal
        as="div"
        className="page-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <span className="eyebrow">Your order</span>
          <h1 className="page-title">
            Review, then <em>send it over</em>.
          </h1>
          <p className="page-sub">
            Items, promo codes, totals. One tap to the kitchen.
          </p>
        </div>
        <MagneticButton
          as={Link}
          to="/menu"
          className="btn btn-ghost"
          strength={6}
        >
          ← Back to menu
        </MagneticButton>
      </Reveal>

      {placed && (
        <div
          className="card"
          style={{
            marginBottom: 24,
            background: 'var(--sage-tint)',
            border: '1px solid rgba(107,142,90,0.28)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <span className="badge badge-sage">ORDER PLACED</span>
            <p
              style={{
                marginTop: 10,
                color: 'var(--ink)',
                fontWeight: 500,
                fontFamily: 'var(--font-display)',
                fontSize: 16,
                letterSpacing: '-0.015em',
              }}
            >
              Order #{placed.id} sent to the kitchen — total{' '}
              <em style={{ color: 'var(--ember-deep)', fontStyle: 'italic', fontWeight: 380 }}>
                ${placed.total.toFixed(2)}
              </em>
            </p>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setPlaced(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      <div
        className="grid-2"
        style={{
          gridTemplateColumns: 'minmax(0,1fr) 360px',
          gap: 20,
          alignItems: 'start',
        }}
      >
        {/* ── Cart items ──────────────────────────── */}
        <Reveal>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid var(--rule)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 20,
                  fontWeight: 500,
                  color: 'var(--ink)',
                  letterSpacing: '-0.02em',
                }}
              >
                Items (
                {cart.reduce((n, i) => n + i.qty, 0)})
              </h2>
              {cart.length > 0 && (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setCart([])}
                >
                  Clear all
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="empty-state">
                <span style={{ fontSize: 28, color: 'var(--ember)' }}>⬢</span>
                <span>Your cart is empty.</span>
                <MagneticButton
                  as={Link}
                  to="/menu"
                  className="btn btn-ember btn-sm"
                  strength={6}
                >
                  Browse the menu
                </MagneticButton>
              </div>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {cart.map((item, idx) => (
                  <li
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: 16,
                      alignItems: 'center',
                      padding: '18px 24px',
                      borderBottom:
                        idx === cart.length - 1
                          ? 'none'
                          : '1px solid var(--rule-soft)',
                      animation: `cardIn 0.35s ${idx * 0.06}s var(--ease-out) both`,
                    }}
                  >
                    <div
                      style={{
                        width: 68,
                        height: 68,
                        borderRadius: 12,
                        overflow: 'hidden',
                        background: 'var(--paper-soft)',
                        flexShrink: 0,
                        border: '1px solid var(--rule)',
                      }}
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 16,
                          fontWeight: 500,
                          color: 'var(--ink)',
                          letterSpacing: '-0.015em',
                        }}
                      >
                        {item.name}
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                          color: 'var(--ink-faint)',
                          marginTop: 3,
                        }}
                      >
                        ${item.price.toFixed(2)} × {item.qty}
                      </p>
                    </div>

                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        background: 'var(--paper-soft)',
                        border: '1px solid var(--rule)',
                        borderRadius: 99,
                        padding: '4px 6px',
                      }}
                    >
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        aria-label="Decrease quantity"
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--ink)',
                          cursor: 'pointer',
                          fontSize: 14,
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 12,
                          color: 'var(--ink)',
                          minWidth: 18,
                          textAlign: 'center',
                        }}
                      >
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, +1)}
                        aria-label="Increase quantity"
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: 'var(--ember)',
                          border: 'none',
                          color: 'var(--paper-mist)',
                          cursor: 'pointer',
                          fontSize: 14,
                        }}
                      >
                        +
                      </button>
                    </div>

                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 18,
                        fontWeight: 500,
                        color: 'var(--ember-deep)',
                        minWidth: 76,
                        textAlign: 'right',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      ${(item.price * item.qty).toFixed(2)}
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        background: 'var(--ember-tint)',
                        border: '1px solid rgba(232,111,78,0.22)',
                        color: 'var(--ember-deep)',
                        cursor: 'pointer',
                        fontSize: 14,
                      }}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>

        {/* ── Summary ─────────────────────────────── */}
        <Reveal>
          <aside
            className="card"
            style={{
              position: 'sticky',
              top: 92,
              padding: 26,
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <div>
              <span className="eyebrow">Summary</span>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  fontWeight: 500,
                  color: 'var(--ink)',
                  marginTop: 6,
                  letterSpacing: '-0.02em',
                }}
              >
                Tonight&rsquo;s <em style={{ color: 'var(--ember-deep)', fontStyle: 'italic', fontWeight: 380 }}>bill</em>
              </h2>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                fontSize: 14,
              }}
            >
              <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <Row label="Tax (10%)" value={`$${tax.toFixed(2)}`} />
              {discount > 0 && (
                <Row
                  label={`Discount (${promoPct}%)`}
                  value={`-$${discount.toFixed(2)}`}
                  valueColor="var(--sage)"
                />
              )}
              <div
                style={{
                  height: 1,
                  background: 'var(--rule)',
                  margin: '6px 0',
                }}
              />
              <Row label="Total" value={`$${total.toFixed(2)}`} bold />
            </div>

            {/* Promo */}
            <div>
              <label
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--ink-faint)',
                  letterSpacing: '0.14em',
                  display: 'block',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                }}
              >
                Promo code
              </label>

              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  className="input"
                  placeholder="e.g. SAVE10"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                  style={{ flex: 1 }}
                />
                {promoPct > 0 ? (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={clearPromo}
                  >
                    ✕
                  </button>
                ) : (
                  <button
                    className="btn btn-ember btn-sm"
                    onClick={applyPromo}
                  >
                    Apply
                  </button>
                )}
              </div>
              {promoError && (
                <p
                  style={{
                    color: 'var(--ember-deep)',
                    fontSize: 11,
                    marginTop: 6,
                  }}
                >
                  {promoError}
                </p>
              )}
              {promoPct > 0 && (
                <p
                  style={{
                    color: 'var(--sage)',
                    fontSize: 11,
                    marginTop: 6,
                  }}
                >
                  ✓ {promoInput.toUpperCase()} applied — {promoPct}% off
                </p>
              )}
              <p
                style={{
                  color: 'var(--ink-faint)',
                  fontSize: 10,
                  marginTop: 8,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.04em',
                }}
              >
                Try SAVE10, SAVE20, WELCOME
              </p>
            </div>

            <button
              onClick={placeOrder}
              disabled={cart.length === 0}
              className="btn btn-ember"
              style={{
                padding: '16px 16px',
                justifyContent: 'center',
                opacity: cart.length === 0 ? 0.5 : 1,
                cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Checkout · ${total.toFixed(2)}
            </button>

            <p
              style={{
                color: 'var(--ink-faint)',
                fontSize: 11,
                textAlign: 'center',
                lineHeight: 1.5,
              }}
            >
              Orders route straight to the kitchen display.
            </p>
          </aside>
        </Reveal>
      </div>
    </div>
  );
}

function Row({ label, value, valueColor, bold = false }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
      }}
    >
      <span
        style={{
          color: bold ? 'var(--ink)' : 'var(--ink-mid)',
          fontWeight: bold ? 500 : 400,
          fontSize: bold ? 15 : 14,
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: valueColor || (bold ? 'var(--ember-deep)' : 'var(--ink)'),
          fontWeight: bold ? 500 : 500,
          fontSize: bold ? 24 : 14,
          fontFamily: bold ? 'var(--font-display)' : 'var(--font-body)',
          letterSpacing: bold ? '-0.025em' : '0',
        }}
      >
        {value}
      </span>
    </div>
  );
}
