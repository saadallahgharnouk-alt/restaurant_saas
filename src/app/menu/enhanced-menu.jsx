import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuCard from '../../components/MenuCard';
import { Reveal, MagneticButton } from '../../components/primitives';

const MENU = [
  { id: 1, name: 'Classic Burger',       category: 'Burgers',  price: 12.99, discount: 10, description: 'Juicy prime beef patty, aged cheddar, crisp lettuce, tomato, onion, brioche bun.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=70' },
  { id: 2, name: 'Pepperoni Pizza',      category: 'Pizza',    price: 14.99, discount: 0,  description: 'Fresh mozzarella, classic pepperoni, stone-baked sourdough base.', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=70' },
  { id: 3, name: 'Caesar Salad',         category: 'Salads',   price: 9.99,  discount: 15, description: 'Crisp romaine, shaved parmesan, anchovy dressing, sourdough croutons.', image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=600&q=70' },
  { id: 4, name: 'Grilled Salmon',       category: 'Seafood',  price: 18.99, discount: 0,  description: 'Atlantic salmon fillet, lemon butter, seasonal greens.', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=70' },
  { id: 5, name: 'Spaghetti Carbonara',  category: 'Pasta',    price: 13.99, discount: 20, description: 'Traditional Roman carbonara — guanciale, pecorino, fresh egg yolk.', image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=600&q=70' },
  { id: 6, name: 'Chocolate Fondant',    category: 'Desserts', price: 7.99,  discount: 0,  description: 'Dark chocolate, molten centre, vanilla ice cream.', image: 'https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?auto=format&fit=crop&w=600&q=70' },
];

export default function EnhancedMenuPage() {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart]         = useState([]);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(MENU.map((i) => i.category)))],
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MENU.filter((i) => {
      const okCat = category === 'All' || i.category === category;
      const okSearch =
        !q ||
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q);
      return okCat && okSearch;
    });
  }, [search, category]);

  const addToCart = (item) => setCart((c) => [...c, item]);

  const cartTotal = cart.reduce(
    (s, i) => s + i.price * (1 - (i.discount || 0) / 100),
    0
  );

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
          <span className="eyebrow">The menu</span>
          <h1 className="page-title">
            Every dish, with <em>its own story</em>.
          </h1>
          <p className="page-sub">
            {MENU.length} dishes &middot; filter by category or search by name.
          </p>
        </div>
        <MagneticButton
          as={Link}
          to="/qr"
          className="btn btn-ghost btn-arrow"
          strength={8}
        >
          Print QR for this menu
        </MagneticButton>
      </Reveal>

      {/* Filters */}
      <Reveal>
        <div className="card" style={{ marginBottom: 28, padding: '16px 20px' }}>
          <div
            style={{
              display: 'flex',
              gap: 14,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                position: 'relative',
                flex: '1 1 240px',
                maxWidth: 360,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--ink-faint)',
                  fontSize: 14,
                  pointerEvents: 'none',
                }}
              >
                ⌕
              </span>
              <input
                className="input"
                placeholder="Search dishes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 36 }}
              />
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`btn btn-sm ${
                    category === c ? 'btn-ember' : 'btn-ghost'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: 28, color: 'var(--ember)' }}>◈</span>
          <span>No dishes match your search.</span>
        </div>
      ) : (
        <Reveal stagger className="grid-3 stagger">
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
          ))}
        </Reveal>
      )}

      {/* Floating cart pill */}
      {cart.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 28,
            right: 28,
            zIndex: 80,
            background: 'var(--ink)',
            color: 'var(--paper-mist)',
            padding: '14px 22px',
            borderRadius: 99,
            boxShadow: 'var(--lift-4)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            animation: 'slideUp 0.4s var(--ease-spring)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.1em',
              color: 'rgba(245,239,227,0.7)',
            }}
          >
            {cart.length} ITEM{cart.length === 1 ? '' : 'S'}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: 18,
              letterSpacing: '-0.02em',
            }}
          >
            ${cartTotal.toFixed(2)}
          </span>
          <Link
            to="/order"
            style={{
              background: 'var(--ember)',
              padding: '8px 16px',
              borderRadius: 99,
              color: 'var(--paper-mist)',
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            View →
          </Link>
        </div>
      )}
    </div>
  );
}
