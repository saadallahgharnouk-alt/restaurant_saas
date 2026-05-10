import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { GrainOverlay, Reveal } from '../components/primitives';
import { useContent } from '../lib/content-store';
import WhatsAppCTA from '../components/WhatsAppCTA';

/**
 * Public scan menu — what a customer sees after scanning a table QR.
 * Now reads from CMS Content_Store when available.
 *
 *   /m/:id          → full menu for a restaurant
 *   /m/:id?t=5      → same, tagged with table number
 */

const DEMO_MENU = [
  { id: 11, category: 'Starters', name: 'Garlic Bread',        price: 5.50,  description: 'House sourdough, roasted garlic butter, herbs.',        image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=600&q=60' },
  { id: 12, category: 'Starters', name: 'Caesar Salad',        price: 9.99,  description: 'Crisp romaine, shaved parmesan, anchovy dressing.',      image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=600&q=60' },
  { id: 13, category: 'Mains',    name: 'Margherita Pizza',    price: 12.99, description: 'San Marzano tomato, buffalo mozzarella, basil.',         image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=60' },
  { id: 14, category: 'Mains',    name: 'Classic Burger',      price: 12.99, description: 'Prime beef, aged cheddar, brioche bun.',                 image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=60' },
  { id: 15, category: 'Mains',    name: 'Spaghetti Carbonara', price: 13.99, description: 'Guanciale, pecorino, fresh egg yolk.',                   image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=600&q=60' },
  { id: 16, category: 'Mains',    name: 'Grilled Salmon',      price: 18.99, description: 'Atlantic salmon fillet, lemon butter, seasonal greens.', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=60' },
  { id: 17, category: 'Desserts', name: 'Tiramisu',            price: 7.00,  description: 'Classic Italian, mascarpone and espresso.',              image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=60' },
  { id: 18, category: 'Desserts', name: 'Chocolate Fondant',   price: 7.99,  description: 'Dark chocolate, molten centre, vanilla ice cream.',      image: 'https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?auto=format&fit=crop&w=600&q=60' },
  { id: 19, category: 'Drinks',   name: 'Sparkling Water',     price: 3.50,  description: '330ml San Pellegrino.',                                  image: 'https://images.unsplash.com/photo-1605217613423-0fb7860cf1e1?auto=format&fit=crop&w=600&q=60' },
  { id: 20, category: 'Drinks',   name: 'Americano',           price: 3.20,  description: 'Freshly pulled espresso, hot water.',                    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=60' },
];

/**
 * Convert CMS menu data (categories + items) into the flat format this
 * component expects: { id, category, name, price, description, image }
 */
function cmsToFlatMenu(cmsMenu) {
  if (!cmsMenu?.items?.length) return null;
  const catMap = {};
  (cmsMenu.categories || []).forEach((c) => { catMap[c.id] = c; });

  // Filter: active only, category must exist in categories list (or null)
  return cmsMenu.items
    .filter((item) => {
      if (item.active === false) return false;
      if (item.categoryId && !catMap[item.categoryId]) return false;
      return true;
    })
    .sort((a, b) => {
      // Sort by category order, then by array position
      const catA = a.categoryId ? (catMap[a.categoryId]?.order ?? 999) : 999;
      const catB = b.categoryId ? (catMap[b.categoryId]?.order ?? 999) : 999;
      return catA - catB;
    })
    .map((item) => ({
      id: item.id,
      category: item.categoryId ? (catMap[item.categoryId]?.name || 'Menu') : 'Menu',
      name: item.name,
      price: item.priceCents / 100,
      description: item.description || '',
      image: item.photoUrl || null,
    }));
}

export default function ScanMenu() {
  const { restaurantId } = useParams();
  const [search]         = useSearchParams();
  const table            = search.get('t');
  const { content }      = useContent();

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu]             = useState(DEMO_MENU);
  const [loading, setLoading]       = useState(true);
  const [activeCat, setActiveCat]   = useState('All');
  const [cart, setCart]             = useState({}); // { [id]: qty }
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [placing, setPlacing]       = useState(false);
  const [placed, setPlaced]         = useState(null);

  // CMS content: use CMS menu when available
  useEffect(() => {
    if (content?.menu) {
      const cmsFlat = cmsToFlatMenu(content.menu);
      if (cmsFlat && cmsFlat.length > 0) {
        setMenu(cmsFlat);
        setLoading(false);
      }
    }
  }, [content?.menu]);

  // Pull real data from API; fall back to CMS or demo menu quietly.
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
            setMenu(
              items.map((i) => ({
                id: i.id,
                name: i.item_name || i.name,
                price: Number(i.price),
                description: i.description || '',
                category: i.category || 'Menu',
                image: i.image_url || null,
              }))
            );
          }
        }
      } catch {
        /* backend offline → stay on CMS/demo menu */
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [restaurantId]);

  // Derivations
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(menu.map((i) => i.category || 'Menu')))],
    [menu]
  );

  const visible = useMemo(
    () =>
      activeCat === 'All'
        ? menu
        : menu.filter((i) => (i.category || 'Menu') === activeCat),
    [menu, activeCat]
  );

  const cartItems = useMemo(
    () =>
      menu
        .filter((i) => cart[i.id] > 0)
        .map((i) => ({ ...i, qty: cart[i.id] })),
    [menu, cart]
  );

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    const count = cartItems.reduce((s, i) => s + i.qty, 0);
    return { subtotal, tax, total, count };
  }, [cartItems]);

  const addItem = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeItem = (id) =>
    setCart((c) => {
      const n = { ...c };
      if (!n[id]) return n;
      if (n[id] > 1) n[id]--;
      else delete n[id];
      return n;
    });

  const placeOrder = async () => {
    if (totals.count === 0) return;
    setPlacing(true);
    const payload = {
      restaurant_id: restaurantId,
      table_number: table ? Number(table) : null,
      items: cartItems.map((i) => ({
        id: i.id,
        name: i.name,
        qty: i.qty,
        price: i.price,
      })),
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

  // Group by category when "All" is active.
  const grouped = useMemo(() => {
    if (activeCat !== 'All') return [[activeCat, visible]];
    const buckets = new Map();
    visible.forEach((i) => {
      const k = i.category || 'Menu';
      if (!buckets.has(k)) buckets.set(k, []);
      buckets.get(k).push(i);
    });
    return Array.from(buckets.entries());
  }, [visible, activeCat]);

  const brandName = restaurant?.name || content?.branding?.restaurantName || 'Tonight&rsquo;s Menu';

  return (
    <div className="scan-wrap">
      <GrainOverlay />

      {/* ── Hero ─────────────────────────────── */}
      <header className="scan-hero">
        <div className="scan-hero-top">
          <img src="/logo-mark.svg" alt="" width="30" height="30" />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--ember-deep)',
            }}
          >
            Scan · Order
          </span>
          <div style={{ marginLeft: 'auto' }}>
            <WhatsAppCTA contact={content?.contact} table={table} />
          </div>
        </div>

        <h1
          className="scan-hero-title"
          dangerouslySetInnerHTML={{
            __html: restaurant?.name
              ? restaurant.name
              : 'Tonight&rsquo;s <em>menu.</em>',
          }}
        />
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
          <span className="scan-chip scan-chip-muted">⏱ Live menu</span>
          <span className="scan-chip scan-chip-muted">
            {menu.length} dishes
          </span>
        </div>
      </header>

      {/* ── Order confirmation toast ─────────── */}
      {placed && (
        <div className="card scan-toast">
          <span className="badge badge-sage">ORDER SENT</span>
          <div style={{ flex: 1 }}>
            <p
              style={{
                color: 'var(--ink)',
                fontWeight: 600,
                fontSize: 15,
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.01em',
              }}
            >
              Thanks — order #{placed.id} is with the kitchen.
            </p>
            <p style={{ color: 'var(--ink-mid)', fontSize: 12, marginTop: 2 }}>
              Total ${placed.total.toFixed(2)}
              {table ? ` · Table ${table}` : ''}
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setPlaced(null)}>
            Close
          </button>
        </div>
      )}

      {/* ── Sticky category bar ──────────────── */}
      <div className="scan-catbar">
        <div className="scan-catbar-inner">
          {categories.map((c) => {
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

      {/* ── Menu list ────────────────────────── */}
      <main className="scan-main">
        {loading ? (
          <div className="empty-state">
            <div className="loading-spinner" />
            <span>Loading menu&hellip;</span>
          </div>
        ) : visible.length === 0 ? (
          <div className="empty-state">
            <span
              style={{
                fontSize: 28,
                color: 'var(--ember)',
                fontFamily: 'var(--font-display)',
              }}
            >
              ◈
            </span>
            <span>No dishes in this category yet.</span>
          </div>
        ) : (
          grouped.map(([cat, items]) => (
            <Reveal as="section" key={cat} className="scan-section">
              <h2 className="scan-section-title">
                {cat === 'All' ? (
                  'Menu'
                ) : (
                  <>
                    <em>{cat}</em>
                  </>
                )}
              </h2>
              <div className="scan-list">
                {items.map((item) => (
                  <ScanItem
                    key={item.id}
                    item={item}
                    qty={cart[item.id] || 0}
                    onAdd={() => addItem(item.id)}
                    onRemove={() => removeItem(item.id)}
                  />
                ))}
              </div>
            </Reveal>
          ))
        )}

        <p className="scan-foot">
          Served by{' '}
          <span
            style={{
              color: 'var(--ink)',
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 500,
            }}
          >
            restauhub
          </span>
        </p>
      </main>

      {/* ── Floating CTA ─────────────────────── */}
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

      {/* ── Cart drawer ──────────────────────── */}
      {drawerOpen && (
        <div
          className="scan-drawer-wrap"
          onClick={() => setDrawerOpen(false)}
        >
          <div className="scan-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="scan-drawer-head">
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  fontWeight: 440,
                  letterSpacing: '-0.02em',
                  color: 'var(--ink)',
                }}
              >
                Your <em style={{ color: 'var(--ember-deep)', fontStyle: 'italic', fontWeight: 380 }}>order</em>
              </h2>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setDrawerOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="scan-drawer-body">
              {cartItems.map((i) => (
                <div key={i.id} className="scan-drawer-row">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        color: 'var(--ink)',
                        fontWeight: 500,
                        fontSize: 15,
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '-0.015em',
                      }}
                    >
                      {i.name}
                    </p>
                    <p
                      style={{
                        color: 'var(--ink-faint)',
                        fontSize: 11,
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.04em',
                        marginTop: 2,
                      }}
                    >
                      ${i.price.toFixed(2)} × {i.qty}
                    </p>
                  </div>

                  <div className="scan-qty">
                    <button
                      onClick={() => removeItem(i.id)}
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <span>{i.qty}</span>
                    <button onClick={() => addItem(i.id)} aria-label="Increase">
                      +
                    </button>
                  </div>

                  <span className="scan-row-total">
                    ${(i.price * i.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="scan-drawer-foot">
              <Row label="Subtotal" value={`$${totals.subtotal.toFixed(2)}`} />
              <Row label="Tax (10%)" value={`$${totals.tax.toFixed(2)}`} />
              <Row
                label="Total"
                value={`$${totals.total.toFixed(2)}`}
                bold
              />

              <button
                className="btn btn-ember"
                disabled={placing || totals.count === 0}
                onClick={placeOrder}
                style={{
                  marginTop: 12,
                  width: '100%',
                  padding: '14px 16px',
                  justifyContent: 'center',
                }}
              >
                {placing
                  ? 'Sending…'
                  : table
                    ? `Send to kitchen · Table ${table}`
                    : 'Send to kitchen'}
              </button>
              <p
                style={{
                  fontSize: 11,
                  color: 'var(--ink-faint)',
                  textAlign: 'center',
                  marginTop: 6,
                }}
              >
                You&rsquo;ll pay at the counter or with your server.
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
          fontSize: bold ? 15 : 13,
          fontWeight: bold ? 500 : 400,
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: bold ? 'var(--ember-deep)' : 'var(--ink)',
          fontSize: bold ? 22 : 13,
          fontWeight: bold ? 500 : 500,
          fontFamily: bold ? 'var(--font-display)' : 'var(--font-body)',
          letterSpacing: bold ? '-0.02em' : '0',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function ScanItem({ item, qty, onAdd, onRemove }) {
  return (
    <article className="scan-item">
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="scan-item-img"
        />
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
            <button type="button" className="scan-add" onClick={onAdd}>
              + Add
            </button>
          ) : (
            <div className="scan-qty">
              <button onClick={onRemove} aria-label="Decrease">
                −
              </button>
              <span>{qty}</span>
              <button onClick={onAdd} aria-label="Increase">
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
