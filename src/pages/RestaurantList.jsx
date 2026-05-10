import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Reveal,
  TiltCard,
  MagneticButton,
  AnimatedNumber,
} from '../components/primitives';

const MOCK_RESTAURANTS = [
  { id: 1, name: 'La Bella Italia',    created_at: '2022-03-14', cuisine: 'Italian',  icon: '🍝', orders: 1204, revenue: 48200 },
  { id: 2, name: 'Tokyo Bites',        created_at: '2023-01-08', cuisine: 'Japanese', icon: '🍣', orders: 987,  revenue: 39100 },
  { id: 3, name: 'El Fuego Taqueria',  created_at: '2023-07-22', cuisine: 'Mexican',  icon: '🌮', orders: 1540, revenue: 52800 },
  { id: 4, name: 'The Garden Bistro',  created_at: '2021-11-30', cuisine: 'French',   icon: '🥐', orders: 732,  revenue: 31600 },
  { id: 5, name: 'Spice Route',        created_at: '2024-02-01', cuisine: 'Indian',   icon: '🍛', orders: 1100, revenue: 44500 },
  { id: 6, name: 'Blue Ocean Seafood', created_at: '2022-09-15', cuisine: 'Seafood',  icon: '🦞', orders: 860,  revenue: 37200 },
];

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selected, setSelected]       = useState(null);
  const [search, setSearch]           = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      setRestaurants(MOCK_RESTAURANTS);
      setLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, []);

  const filtered = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <Reveal as="div" className="page-header">
        <span className="eyebrow">Partner network</span>
        <h1 className="page-title">
          Six venues,<br />
          <em>one quiet system</em>.
        </h1>
        <p className="page-sub">
          Manage every partner restaurant from one unified view.
        </p>

        <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            className="input"
            placeholder="Search restaurants…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 320 }}
          />
          <button className="btn btn-ember btn-arrow">Onboard a new venue</button>
        </div>
      </Reveal>

      {/* Stats row */}
      <Reveal stagger className="grid-4 stagger" style={{ marginBottom: 36 }}>
        {[
          { label: 'Partners',       value: 6,     delta: '+2 this quarter',      decimals: 0 },
          { label: 'Total orders',   value: 6423,  delta: '↑ 12.4% vs last month',decimals: 0 },
          { label: 'Avg revenue',    value: 42.2,  prefix: '$', suffix: 'k',      delta: 'Per restaurant · mo', decimals: 1 },
          { label: 'Avg rating',     value: 4.7,   suffix: '★', delta: 'Across all venues', decimals: 1 },
        ].map((s, i) => (
          <TiltCard key={i} as="div" className="stat" max={5}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">
              <AnimatedNumber
                value={s.value}
                prefix={s.prefix}
                suffix={s.suffix}
                decimals={s.decimals || 0}
              />
            </div>
            <p
              style={{
                fontSize: 11,
                color: 'var(--ink-faint)',
                marginTop: 8,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.06em',
              }}
            >
              {s.delta}
            </p>
          </TiltCard>
        ))}
      </Reveal>

      {/* Grid */}
      {loading ? (
        <div className="empty-state">
          <div className="loading-spinner" />
          <span>Fetching restaurants&hellip;</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: 32, color: 'var(--ember)' }}>◈</span>
          <p>No restaurants match your search.</p>
        </div>
      ) : (
        <Reveal stagger className="grid-3 stagger">
          {filtered.map((r) => (
            <TiltCard key={r.id} as="div" className="card" max={6}>
              <div onClick={() => setSelected(r)} style={{ cursor: 'pointer' }}>
                <div
                  style={{
                    display: 'flex',
                    gap: 16,
                    alignItems: 'center',
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: 'var(--ember-tint)',
                      border: '1px solid rgba(232,111,78,0.22)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 26,
                    }}
                  >
                    {r.icon || '🍽️'}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 19,
                        fontWeight: 500,
                        color: 'var(--ink)',
                        letterSpacing: '-0.018em',
                      }}
                    >
                      {r.name}
                    </h3>
                    <p
                      style={{
                        fontSize: 11,
                        color: 'var(--ink-faint)',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.06em',
                        marginTop: 2,
                      }}
                    >
                      Since {new Date(r.created_at).getFullYear()}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                  <span className="badge badge-soft">{r.cuisine}</span>
                  <span className="badge badge-sage">
                    {r.orders.toLocaleString()} orders
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: 14,
                    borderTop: '1px solid var(--rule)',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--ink-faint)',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Revenue MTD
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 22,
                        fontWeight: 500,
                        color: 'var(--ember-deep)',
                        letterSpacing: '-0.025em',
                        marginTop: 4,
                      }}
                    >
                      ${r.revenue.toLocaleString()}
                    </p>
                  </div>
                  <span
                    className="btn btn-ghost btn-sm"
                    style={{ pointerEvents: 'none' }}
                  >
                    Open →
                  </span>
                </div>
              </div>
            </TiltCard>
          ))}
        </Reveal>
      )}

      {/* Modal */}
      {selected && (
        <div
          className="modal-overlay"
          onClick={() => setSelected(null)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              ✕
            </button>

            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: 'var(--ember-tint)',
                  border: '1px solid rgba(232,111,78,0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                }}
              >
                {selected.icon || '🍽️'}
              </div>
              <div>
                <span className="eyebrow">Venue</span>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 24,
                    fontWeight: 500,
                    color: 'var(--ink)',
                    marginTop: 6,
                    letterSpacing: '-0.025em',
                  }}
                >
                  {selected.name}
                </h2>
                <span className="badge badge-soft" style={{ marginTop: 6 }}>
                  {selected.cuisine}
                </span>
              </div>
            </div>

            <div className="grid-2" style={{ gap: 12, marginBottom: 22 }}>
              {[
                { label: 'Total orders', value: selected.orders.toLocaleString() },
                { label: 'Revenue MTD',  value: `$${selected.revenue.toLocaleString()}` },
                { label: 'Partner since', value: new Date(selected.created_at).getFullYear() },
                { label: 'Avg ticket',   value: `$${(selected.revenue / selected.orders).toFixed(2)}` },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--paper-soft)',
                    border: '1px solid var(--rule)',
                    borderRadius: 12,
                    padding: '14px 16px',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--ink-faint)',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      marginBottom: 4,
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 22,
                      fontWeight: 500,
                      color: 'var(--ink)',
                      letterSpacing: '-0.025em',
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <MagneticButton
                as={Link}
                to={`/m/${selected.id}`}
                className="btn btn-ember btn-arrow"
                style={{ flex: 1, justifyContent: 'center' }}
                strength={6}
              >
                Open live menu
              </MagneticButton>
              <button className="btn btn-ghost">Edit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
