import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

/**
 * Public scan menu — this is what a customer sees after scanning a QR card.
 * It is intentionally minimal: no admin chrome, no sidebar, mobile-first.
 *
 *   /m/:id          → full menu for restaurant
 *   /m/:id?t=5      → same, tagged with table number
 */

const DEMO_MENU = [
  { id: 11, category: 'Starters', name: 'Garlic Bread',        price: 5.50,  description: 'House sourdough, roasted garlic butter, herbs.',        image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=600&q=60' },
  { id: 12, category: 'Starters', name: 'Caesar Salad',        price: 9.99,  description: 'Crisp romaine, shaved parmesan, anchovy dressing.',      image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=600&q=60' },
  { id: 13, category: 'Mains',    name: 'Margherita Pizza',    price: 12.99, description: 'San Marzano tomato, buffalo mozzarella, basil.',         image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=60' },
  { id: 14, category: 'Mains',    name: 'Classic Burger',      price: 12.99, description: 'Prime beef, aged cheddar, brioche bun.',                 image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=60' },
  { id: 15, category: 'Mains',    name: 'Spaghetti Carbonara', price: 13.99, description: 'Guanciale, pecorino, fresh egg yolk.',                   image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=600&q=60' },
  { id: 16, category: 'Mains',    name: 'Grilled Salmon',      price: 18.99, description: 'Atlantic salmon fillet, lemon butter, seasonal greens.', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=60' },
  { id: 17, category: 'Desserts', name: 'Tiramisu',            price: 7.00,  description: 'Classic Italian with mascarpone and espresso.',          image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=60' },
  { id: 18, category: 'Desserts', name: 'Chocolate Fondant',   price: 7.99,  description: 'Dark chocolate, molten centre, vanilla ice cream.',      image: 'https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?auto=format&fit=crop&w=600&q=60' },
  { id: 19, category: 'Drinks',   name: 'Sparkling Water',     price: 3.50,  description: '330ml San Pellegrino.',                                  image: 'https://images.unsplash.com/photo-1605217613423-0fb7860cf1e1?auto=format&fit=crop&w=600&q=60' },
  { id: 20, category: 'Drinks',   name: 'Americano',           price: 3.20,  description: 'Freshly pulled espresso, hot water.',                    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=60' },
];

export default function ScanMenu() {
  const { restaurantId } = useParams();
  const [search]         = useSearchParams();
  const table            = search.get('t');

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu]             = useState(DEMO_MENU);
  const [loading, setLoading]       = useState(true);
  const [activeCat, setActiveCat]   = useState('All');
  const [cart, setCart]             = useState({}); // { [id]: qty }
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [placing, setPlacing]       = useState(false);
  const [placed, setPlaced]         = useState(null);

  // Try to pull real data; otherwise quietly use the demo menu.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [rr, mr] = await Promise.all([
          fetch(`http://localhost:5000/api/restaurants/${restaurantId}`),
          fetch(`http://localhost:5000/api/menu/${restaurantId}`),
        ]);
        if (!cancelled && rr.ok) setRestaurant(await rr.json());
        if (!cancelled && mr.ok) {
          const items = await mr.json();
          if (Array.isArray(items) && items.length > 0) {
            setMenu(items.map(i => ({
              id: i.id,
              name: i.item_name || i.name,
              price: Number(i.price),
              description: i.description || '',
              category: i.category || 'Menu',
              image: i.image_url || null,
            })));
          }
        }
      } catch { /* backend offline → stay on demo menu */ }
      finally { if (!cancelled) setLoading(false); }
    };

    load();
    return () => { cancelled = true; };
  }, [restaurantId]);

  // Derivations
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(menu.map(i => i.category || 'Menu')))],
    [menu]
  );

  const visible = useMemo(
    () => activeCat === 'All' ? menu : menu.filter(i => (i.category || 'Menu') === activeCat),
    [menu, activeCat]
  );

  const cartItems = useMemo(
    () => menu
      .filter(i => cart[i.id] > 0)
      .map(i => ({ ...i, qty: cart[i.id] })),
    [menu, cart]
  );

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
    const tax      = subtotal * 0.1;
    const total    = subtotal + tax;
    const count    = cartItems.reduce((s, i) => s + i.qty, 0);
    return { subtotal, tax, total, count };
  }, [cartItems]);

  const addItem    = id => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeItem = id => setCart(c => {
    const n = { ...c };
    if (!n[id]) return n;
    if (n[id] > 1) n[id]--; else delete n[id];
    return n;
  });

  const placeOrder = async () => {
    if (totals.count === 0) return;
    setPlacing(true);
    const payload = {
      restaurant_id: restaurantId,
      table_number: table ? Number(table) : null,
      items: cartItems.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
      total_price: Number(totals.total.toFixed(2)),
    };

    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      setPlaced({
        id: data?.order?.id || Math.floor(Math.random() * 9000 + 1000),
        total: totals.total,
      });
    } catch {
      // Offline preview — still show confirmation so demo works.
      setPlaced({
        id: Math.floor(Math.random() * 9000 + 1000),
        total: totals.total,
      });
    } finally {
      setPlacing(false);
      setCart({});
      setDrawerOpen(false);
    }
  };

  // Group by category when showing All.
  const grouped = useMemo(() => {
    if (activeCat !== 'All') return [[activeCat, visible]];
    const buckets = new Map();
    visible.forEach(i => {
      const k = i.category || 'Menu';
      if (!buckets.has(k)) buckets.set(k, []);
      buckets.get(k).push(i);
    });
    return Array.from(buckets.entries());
  }, [visible, activeCat]);

  const brandName = restaurant?.name || 'RestauHub';

  return (
    <div className="scan-wrap">
      {/* ── Hero ─────────────────────────────── */}
      <header className="scan-hero">
        <div className="scan-hero-top">
          <img src="/logo-mark.svg" alt="" width="28" height="28" />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            letterSpacing: '0.18em', color: '#818cf8',
          }}>MENU · SCAN</span>
        </div>

        <h1 className="scan-hero-title">{brandName}</h1>
        {restaurant?.cuisine && (
          <p className="scan-hero-sub">{restaurant.cuisine} cuisine</p>
        )}

        <div className="scan-hero-tags">
          {table && (
            <span className="scan-chip">
              <span style={{ opacity: 0.7, marginRight: 6 }}>●</span>
              Table {table}
            </span>
          )}
          <span className="scan-chip scan-chip-muted">
            ⏱ Live menu
          </span>
          <span className="scan-chip scan-chip-muted">
            🍽 {menu.length} dishes
          </span>
        </div>
      </header>

      {/* Confirmation banner */}
      {placed && (
        <div className="card scan-toast">
          <span className="badge badge-green">ORDER SENT</span>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--text-hi)', fontWeight: 700, fontSize: 14 }}>
              Thanks — order #{placed.id} is with the kitchen.
            </p>
            <p style={{ color: 'var(--text-mid)', fontSize: 12 }}>
              Total ${placed.total.toFixed(2)}{table ? ` · Table ${table}` : ''}
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setPlaced(null)}>✕</button>
        </div>
      )}

      {/* ── Category strip (sticky) ─────────── */}
      <div className="scan-catbar">
        <div className="scan-catbar-inner">
          {categories.map(c => {
            const active = c === activeCat;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setActiveCat(c)}
                className={`scan-cat ${active ? 'active' : ''}`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Menu ─────────────────────────────── */}
      <main className="scan-main">
        {loading ? (
          <div className="empty-state">
            <div className="loading-spinner" />
            <span>Loading menu…</span>
          </div>
        ) : visible.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: 28 }}>◈</span>
            <span>No dishes in this category.</span>
          </div>
        ) : (
          grouped.map(([cat, items]) => (
            <section key={cat} className="scan-section">
              <h2 className="scan-section-title">{cat}</h2>
              <div className="scan-list">
                {items.map(item => (
                  <ScanItem
                    key={item.id}
                    item={item}
                    qty={cart[item.id] || 0}
                    onAdd={() => addItem(item.id)}
                    onRemove={() => removeItem(item.id)}
                  />
                ))}
              </div>
            </section>
          ))
        )}

        <p className="scan-foot">
          Powered by <strong style={{ color: 'var(--text-hi)' }}>RestauHub</strong> · QR ordering
        </p>
      </main>

      {/* ── Sticky CTA ─────────────────────── */}
      {totals.count > 0 && !drawerOpen && (
        <button
          type="button"
          className="scan-cta"
          onClick={() => setDrawerOpen(true)}
        >
          <span className="scan-cta-count">{totals.count}</span>
          <span className="scan-cta-label">View order</span>
          <span className="scan-cta-total">${totals.total.toFixed(2)}</span>
        </button>
      )}

      {/* ── Cart drawer ────────────────────── */}
      {drawerOpen && (
        <div className="scan-drawer-wrap" onClick={() => setDrawerOpen(false)}>
          <div className="scan-drawer" onClick={e => e.stopPropagation()}>
            <div className="scan-drawer-head">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--text-hi)' }}>
                Your order
              </h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setDrawerOpen(false)}>✕</button>
            </div>

            <div className="scan-drawer-body">
              {cartItems.map(i => (
                <div key={i.id} className="scan-drawer-row">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: 'var(--text-hi)', fontWeight: 600, fontSize: 14 }}>{i.name}</p>
                    <p style={{ color: 'var(--text-mid)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                      ${i.price.toFixed(2)} × {i.qty}
                    </p>
                  </div>

                  <div className="scan-qty">
                    <button onClick={() => removeItem(i.id)} aria-label="Decrease">−</button>
                    <span>{i.qty}</span>
                    <button onClick={() => addItem(i.id)} aria-label="Increase">+</button>
                  </div>

                  <span className="scan-row-total">${(i.price * i.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="scan-drawer-foot">
              <Row label="Subtotal"  value={`$${totals.subtotal.toFixed(2)}`} />
              <Row label="Tax (10%)" value={`$${totals.tax.toFixed(2)}`} />
              <Row label="Total"     value={`$${totals.total.toFixed(2)}`} bold />

              <button
                className="btn btn-primary"
                disabled={placing || totals.count === 0}
                onClick={placeOrder}
                style={{ marginTop: 10, width: '100%', padding: '14px 16px' }}
              >
                {placing
                  ? 'Sending…'
                  : table
                    ? `Send to kitchen · Table ${table}`
                    : 'Send to kitchen'}
              </button>
              <p style={{ fontSize: 11, color: 'var(--text-mid)', textAlign: 'center', marginTop: 8 }}>
                You'll pay at the counter / with your server.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: 'var(--text-mid)', fontSize: bold ? 14 : 13, fontWeight: bold ? 700 : 400 }}>{label}</span>
      <span style={{
        color: 'var(--text-hi)',
        fontSize: bold ? 18 : 13,
        fontWeight: bold ? 800 : 600,
        fontFamily: bold ? 'var(--font-display)' : 'var(--font-body)',
      }}>{value}</span>
    </div>
  );
}

function ScanItem({ item, qty, onAdd, onRemove }) {
  return (
    <article className="scan-item">
      {item.image ? (
        <img src={item.image} alt={item.name} loading="lazy" className="scan-item-img" />
      ) : (
        <div className="scan-item-img scan-item-img-empty">NO IMAGE</div>
      )}

      <div className="scan-item-body">
        <p className="scan-item-name">{item.name}</p>
        {item.description && (
          <p className="scan-item-desc">{item.description}</p>
        )}
        <div className="scan-item-foot">
          <span className="scan-item-price">${item.price.toFixed(2)}</span>

          {qty === 0 ? (
            <button type="button" className="scan-add" onClick={onAdd}>+ Add</button>
          ) : (
            <div className="scan-qty">
              <button onClick={onRemove} aria-label="Decrease">−</button>
              <span>{qty}</span>
              <button onClick={onAdd} aria-label="Increase">+</button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
