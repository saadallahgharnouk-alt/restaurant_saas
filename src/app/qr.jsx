import React, { useEffect, useMemo, useState } from 'react';
import MenuQR from '../components/MenuQR';

const FALLBACK_RESTAURANTS = [
  { id: 1, name: 'La Bella Italia',    cuisine: 'Italian',  icon: '🍝' },
  { id: 2, name: 'Tokyo Bites',        cuisine: 'Japanese', icon: '🍣' },
  { id: 3, name: 'El Fuego Taqueria',  cuisine: 'Mexican',  icon: '🌮' },
  { id: 4, name: 'The Garden Bistro',  cuisine: 'French',   icon: '🥐' },
  { id: 5, name: 'Spice Route',        cuisine: 'Indian',   icon: '🍛' },
  { id: 6, name: 'Blue Ocean Seafood', cuisine: 'Seafood',  icon: '🦞' },
];

export default function QRStudio() {
  const [restaurants, setRestaurants]   = useState(FALLBACK_RESTAURANTS);
  const [selectedId, setSelectedId]     = useState(FALLBACK_RESTAURANTS[0].id);
  const [mode, setMode]                 = useState('single'); // single | table | bulk
  const [tableNumber, setTableNumber]   = useState(1);
  const [bulkCount, setBulkCount]       = useState(6);

  // Try to load real restaurants; if the backend isn't up, quietly keep fallbacks.
  useEffect(() => {
    let cancelled = false;
    fetch('http://localhost:5000/api/restaurants')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (cancelled || !Array.isArray(data) || data.length === 0) return;
        setRestaurants(data);
        setSelectedId(data[0].id);
      })
      .catch(() => { /* backend not running, fallback is fine */ });
    return () => { cancelled = true; };
  }, []);

  const selected = useMemo(
    () => restaurants.find(r => String(r.id) === String(selectedId)) || restaurants[0],
    [restaurants, selectedId]
  );

  const effectiveTable = mode === 'table' ? tableNumber : null;

  const bulkTables = useMemo(() => {
    if (mode !== 'bulk') return [];
    const n = Math.max(1, Math.min(48, Number(bulkCount) || 0));
    return Array.from({ length: n }, (_, i) => i + 1);
  }, [mode, bulkCount]);

  return (
    <div className="page">
      <div className="page-header">
        <span className="page-tag">▦ QR Studio</span>
        <h1 className="page-title">QR Code Menus</h1>
        <p className="page-sub">
          Generate a QR that opens your menu on any guest's phone — no app install, no typing.
        </p>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(320px, 400px)', gap: 20, alignItems: 'start' }}>
        {/* ── Left: configuration ─────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Restaurant picker */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text-hi)', letterSpacing: '-0.2px' }}>
                1. Choose a restaurant
              </h2>
              <span className="badge badge-accent">{restaurants.length}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 10 }}>
              {restaurants.map(r => {
                const active = String(r.id) === String(selectedId);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedId(r.id)}
                    className="card"
                    style={{
                      padding: 14,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      background: active ? 'var(--accent-dim)' : 'var(--surface2)',
                      borderColor: active ? 'var(--accent)' : 'var(--border)',
                      boxShadow: active ? '0 0 0 1px var(--accent), 0 12px 30px rgba(99,102,241,0.18)' : 'none',
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{r.icon || '🏪'}</span>
                    <span style={{ minWidth: 0 }}>
                      <p style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 13, fontWeight: 700,
                        color: 'var(--text-hi)',
                        letterSpacing: '-0.2px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>{r.name}</p>
                      {r.cuisine && (
                        <p style={{ fontSize: 10, color: 'var(--text-mid)', fontFamily: 'var(--font-mono)' }}>
                          {r.cuisine.toUpperCase()}
                        </p>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode picker */}
          <div className="card" style={{ padding: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text-hi)', letterSpacing: '-0.2px', marginBottom: 14 }}>
              2. Configure codes
            </h2>

            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
              {[
                { id: 'single', label: 'Single QR',    icon: '▦' },
                { id: 'table',  label: 'Per-table QR', icon: '▣' },
                { id: 'bulk',   label: 'Bulk print',   icon: '⊞' },
              ].map(m => {
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id)}
                    className={`btn btn-sm ${active ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    {m.icon} {m.label}
                  </button>
                );
              })}
            </div>

            {mode === 'single' && (
              <p style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.6 }}>
                One universal code — point it at the front of the restaurant, or on the receipt.
                Customers land on the full menu.
              </p>
            )}

            {mode === 'table' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <label style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-mid)',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>Table #</label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={tableNumber}
                  onChange={e => setTableNumber(Math.max(1, Number(e.target.value) || 1))}
                  className="input"
                  style={{ maxWidth: 120 }}
                />
                <p style={{ fontSize: 11, color: 'var(--text-mid)', flex: 1, minWidth: 200 }}>
                  Each table gets its own code — the order arrives in the kitchen already tagged.
                </p>
              </div>
            )}

            {mode === 'bulk' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <label style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-mid)',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>Tables</label>
                <input
                  type="number"
                  min={1}
                  max={48}
                  value={bulkCount}
                  onChange={e => setBulkCount(Math.max(1, Math.min(48, Number(e.target.value) || 0)))}
                  className="input"
                  style={{ maxWidth: 120 }}
                />
                <p style={{ fontSize: 11, color: 'var(--text-mid)', flex: 1, minWidth: 200 }}>
                  Generate a stack of codes (1 → {bulkCount}) and print them at once.
                </p>
              </div>
            )}
          </div>

          {/* How it works */}
          <div className="card" style={{ padding: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text-hi)', letterSpacing: '-0.2px', marginBottom: 14 }}>
              How it works
            </h2>
            <ol style={{
              listStyle: 'none', padding: 0, margin: 0,
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              {[
                'Print the QR card and place it on the table (or by the entrance).',
                'Guest opens their camera and taps the link — the mobile menu loads.',
                'They add items to the cart and send the order straight to the kitchen.',
              ].map((t, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{
                    width: 22, height: 22, flexShrink: 0,
                    borderRadius: '50%',
                    background: 'var(--accent-dim)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    color: '#818cf8',
                    fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{i + 1}</span>
                  <span style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.55 }}>{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ── Right: preview ─────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 84 }}>
          <p className="page-tag" style={{ margin: 0 }}>LIVE PREVIEW</p>
          <MenuQR restaurant={selected} table={effectiveTable} />
        </div>
      </div>

      {/* ── Bulk grid ───────────────────────── */}
      {mode === 'bulk' && selected && (
        <div style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span className="page-tag">BULK PRINT</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--text-hi)' }}>
                {bulkTables.length} codes for {selected.name}
              </h2>
            </div>
            <button className="btn btn-primary" onClick={() => window.print()}>
              🖨 Print all
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 16,
          }}>
            {bulkTables.map(t => (
              <MenuQR key={t} restaurant={selected} table={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
