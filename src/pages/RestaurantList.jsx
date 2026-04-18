import React, { useState, useEffect } from 'react';

const MOCK_RESTAURANTS = [
  { id: 1, name: 'La Bella Italia',    created_at: '2022-03-14', cuisine: 'Italian',  orders: 1204, revenue: 48200 },
  { id: 2, name: 'Tokyo Bites',        created_at: '2023-01-08', cuisine: 'Japanese', orders: 987,  revenue: 39100 },
  { id: 3, name: 'El Fuego Taqueria',  created_at: '2023-07-22', cuisine: 'Mexican',  orders: 1540, revenue: 52800 },
  { id: 4, name: 'The Garden Bistro',  created_at: '2021-11-30', cuisine: 'French',   orders: 732,  revenue: 31600 },
  { id: 5, name: 'Spice Route',        created_at: '2024-02-01', cuisine: 'Indian',   orders: 1100, revenue: 44500 },
  { id: 6, name: 'Blue Ocean Seafood', created_at: '2022-09-15', cuisine: 'Seafood',  orders: 860,  revenue: 37200 },
];

const ICONS = { Italian: '🍝', Japanese: '🍣', Mexican: '🌮', French: '🥐', Indian: '🍛', Seafood: '🦞' };

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selected, setSelected]       = useState(null);
  const [search, setSearch]           = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      setRestaurants(MOCK_RESTAURANTS);
      setLoading(false);
    }, 900);
    return () => clearTimeout(t);
  }, []);

  const filtered = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      {/* Hero */}
      <div className="hero-banner">
        <span className="hero-tag">◈ Partner Network</span>
        <h1 className="hero-title">Restaurant<br />Directory</h1>
        <p className="hero-sub">Manage and monitor all partner restaurants from one unified platform.</p>
        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
          <input
            className="input"
            placeholder="Search restaurants…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 320, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 16px', color: 'var(--text-hi)' }}
          />
          <button className="btn btn-primary">+ Onboard New</button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid-4 stagger" style={{ marginBottom: 28 }}>
        {[
          { label: 'Total Partners', value: '6', change: '+2 this quarter' },
          { label: 'Total Orders',   value: '6,423', change: '↑ 12.4% vs last month' },
          { label: 'Avg Revenue',    value: '$42.2k', change: 'Per restaurant/mo' },
          { label: 'Avg Rating',     value: '4.7★', change: 'Across all venues' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <p className="stat-label">{s.label}</p>
            <p className="stat-value">{s.value}</p>
            <p className="stat-change up" style={{ color: 'var(--text-mid)', fontSize: 11 }}>{s.change}</p>
          </div>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <span style={{ color: 'var(--text-mid)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>Fetching restaurants…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <span style={{ fontSize: 32 }}>◈</span>
          <p style={{ color: 'var(--text-mid)' }}>No restaurants match your search</p>
        </div>
      ) : (
        <div className="grid-3 stagger">
          {filtered.map((r, i) => (
            <div
              key={r.id}
              className="card card-glow"
              style={{ animationDelay: `${i * 0.07}s`, cursor: 'pointer' }}
              onClick={() => setSelected(r)}
            >
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 32 }}>{ICONS[r.cuisine] || '🍽️'}</div>
                <div>
                  <h3 style={{ color: 'var(--text-hi)', fontWeight: 700 }}>{r.name}</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-mid)' }}>Since {new Date(r.created_at).getFullYear()}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <span className="badge badge-accent">{r.cuisine}</span>
                <span className="badge badge-green">{r.orders.toLocaleString()} orders</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-mid)' }}>REVENUE MTD</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-hi)' }}>
                    ${r.revenue.toLocaleString()}
                  </p>
                </div>
                <button className="btn btn-ghost btn-sm">Open →</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ fontSize: 32 }}>{ICONS[selected.cuisine] || '🍽️'}</div>
                <div>
                  <h2 className="page-title" style={{ fontSize: 22 }}>{selected.name}</h2>
                  <span className="badge badge-accent" style={{ marginTop: 6 }}>{selected.cuisine}</span>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="grid-2" style={{ gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Total Orders', value: selected.orders.toLocaleString() },
                { label: 'Revenue MTD',  value: `$${selected.revenue.toLocaleString()}` },
                { label: 'Partner Since', value: new Date(selected.created_at).getFullYear() },
                { label: 'Avg Ticket',   value: `$${(selected.revenue / selected.orders).toFixed(2)}` },
              ].map((item, i) => (
                <div key={i} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-mid)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-hi)' }}>{item.value}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" style={{ flex: 1 }}>View Dashboard</button>
              <button className="btn btn-ghost">Edit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
