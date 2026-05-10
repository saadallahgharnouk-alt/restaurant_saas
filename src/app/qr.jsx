import React, { useEffect, useMemo, useState } from 'react';
import MenuQR from '../components/MenuQR';
import { Reveal, TiltCard, MagneticButton } from '../components/primitives';

const FALLBACK_RESTAURANTS = [
  { id: 1, name: 'La Bella Italia',    cuisine: 'Italian',  icon: '🍝' },
  { id: 2, name: 'Tokyo Bites',        cuisine: 'Japanese', icon: '🍣' },
  { id: 3, name: 'El Fuego Taqueria',  cuisine: 'Mexican',  icon: '🌮' },
  { id: 4, name: 'The Garden Bistro',  cuisine: 'French',   icon: '🥐' },
  { id: 5, name: 'Spice Route',        cuisine: 'Indian',   icon: '🍛' },
  { id: 6, name: 'Blue Ocean Seafood', cuisine: 'Seafood',  icon: '🦞' },
];

const MODES = [
  { id: 'single', label: 'Single QR',    hint: 'One universal code.' },
  { id: 'table',  label: 'Per-table QR', hint: 'Tagged to a specific seat.' },
  { id: 'bulk',   label: 'Bulk print',   hint: 'One code per table, printed.' },
];

export default function QRStudio() {
  const [restaurants, setRestaurants] = useState(FALLBACK_RESTAURANTS);
  const [selectedId, setSelectedId]   = useState(FALLBACK_RESTAURANTS[0].id);
  const [mode, setMode]               = useState('single');
  const [tableNumber, setTableNumber] = useState(1);
  const [bulkCount, setBulkCount]     = useState(6);

  // Try real API; silently fall back otherwise.
  useEffect(() => {
    let cancelled = false;
    fetch('http://localhost:5000/api/restaurants')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !Array.isArray(data) || data.length === 0) return;
        setRestaurants(data);
        setSelectedId(data[0].id);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = useMemo(
    () =>
      restaurants.find((r) => String(r.id) === String(selectedId)) ||
      restaurants[0],
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
      <Reveal as="div" className="page-header">
        <span className="eyebrow">QR Studio</span>
        <h1 className="page-title">
          Print a code.<br />
          Let guests <em>walk in already ordering</em>.
        </h1>
        <p className="page-sub">
          Generate a QR that opens your menu on any guest&rsquo;s phone &mdash;
          no app install, no typing, no friction.
        </p>
      </Reveal>

      <div
        className="grid-2"
        style={{
          gridTemplateColumns: 'minmax(0,1fr) minmax(320px, 420px)',
          gap: 24,
          alignItems: 'start',
        }}
      >
        {/* ── Left: configuration ────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Restaurant picker */}
          <Reveal>
            <div className="card" style={{ padding: 24 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 16,
                }}
              >
                <div>
                  <span className="eyebrow">Step 01</span>
                  <h2
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 22,
                      fontWeight: 440,
                      letterSpacing: '-0.02em',
                      color: 'var(--ink)',
                      marginTop: 6,
                    }}
                  >
                    Choose a <em style={{ color: 'var(--ember-deep)', fontStyle: 'italic', fontWeight: 380 }}>venue</em>
                  </h2>
                </div>
                <span className="badge badge-soft">{restaurants.length}</span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fill, minmax(190px, 1fr))',
                  gap: 10,
                }}
              >
                {restaurants.map((r) => {
                  const active = String(r.id) === String(selectedId);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedId(r.id)}
                      style={{
                        padding: '14px 16px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        background: active ? 'var(--ember-tint)' : 'var(--paper-soft)',
                        border: `1px solid ${active ? 'var(--ember)' : 'var(--rule)'}`,
                        borderRadius: 14,
                        color: 'inherit',
                        transition:
                          'background 0.25s, border-color 0.25s, transform 0.25s var(--ease-out)',
                        transform: active ? 'translateY(-1px)' : 'translateY(0)',
                        boxShadow: active ? 'var(--lift-1)' : 'none',
                      }}
                    >
                      <span style={{ fontSize: 24 }}>{r.icon || '🏪'}</span>
                      <span style={{ minWidth: 0 }}>
                        <p
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 15,
                            fontWeight: 500,
                            color: 'var(--ink)',
                            letterSpacing: '-0.015em',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {r.name}
                        </p>
                        {r.cuisine && (
                          <p
                            style={{
                              fontSize: 10,
                              color: active
                                ? 'var(--ember-deep)'
                                : 'var(--ink-faint)',
                              fontFamily: 'var(--font-mono)',
                              letterSpacing: '0.1em',
                              marginTop: 2,
                              textTransform: 'uppercase',
                            }}
                          >
                            {r.cuisine}
                          </p>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Mode picker */}
          <Reveal>
            <div className="card" style={{ padding: 24 }}>
              <div style={{ marginBottom: 16 }}>
                <span className="eyebrow">Step 02</span>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 22,
                    fontWeight: 440,
                    letterSpacing: '-0.02em',
                    color: 'var(--ink)',
                    marginTop: 6,
                  }}
                >
                  Configure the <em style={{ color: 'var(--ember-deep)', fontStyle: 'italic', fontWeight: 380 }}>codes</em>
                </h2>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  marginBottom: 16,
                  flexWrap: 'wrap',
                }}
              >
                {MODES.map((m) => {
                  const active = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id)}
                      className={`btn btn-sm ${active ? 'btn-ember' : 'btn-ghost'}`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>

              <p
                style={{
                  fontSize: 13,
                  color: 'var(--ink-mid)',
                  lineHeight: 1.6,
                  marginBottom: mode === 'single' ? 0 : 14,
                }}
              >
                {MODES.find((m) => m.id === mode)?.hint}
              </p>

              {mode === 'table' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    flexWrap: 'wrap',
                  }}
                >
                  <label
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--ink-faint)',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Table #
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={tableNumber}
                    onChange={(e) =>
                      setTableNumber(Math.max(1, Number(e.target.value) || 1))
                    }
                    className="input"
                    style={{ maxWidth: 120 }}
                  />
                  <p
                    style={{
                      fontSize: 12,
                      color: 'var(--ink-faint)',
                      flex: 1,
                      minWidth: 200,
                    }}
                  >
                    Orders arrive already tagged for the server.
                  </p>
                </div>
              )}

              {mode === 'bulk' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    flexWrap: 'wrap',
                  }}
                >
                  <label
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--ink-faint)',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Tables
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={48}
                    value={bulkCount}
                    onChange={(e) =>
                      setBulkCount(
                        Math.max(1, Math.min(48, Number(e.target.value) || 0))
                      )
                    }
                    className="input"
                    style={{ maxWidth: 120 }}
                  />
                  <p
                    style={{
                      fontSize: 12,
                      color: 'var(--ink-faint)',
                      flex: 1,
                      minWidth: 200,
                    }}
                  >
                    Generates codes 1 → {bulkCount} in one print-ready sheet.
                  </p>
                </div>
              )}
            </div>
          </Reveal>

          {/* How it works */}
          <Reveal>
            <div className="card" style={{ padding: 24 }}>
              <span className="eyebrow">How it works</span>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  fontWeight: 440,
                  letterSpacing: '-0.02em',
                  color: 'var(--ink)',
                  margin: '6px 0 20px',
                }}
              >
                Three <em style={{ color: 'var(--ember-deep)', fontStyle: 'italic', fontWeight: 380 }}>moments</em>
              </h2>

              <ol
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                {[
                  'Print the QR card and place it on the table (or by the entrance).',
                  'Guest taps their camera — the menu opens in one tap, no app.',
                  'They add items, send to kitchen. The board lights up instantly.',
                ].map((t, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 14,
                      alignItems: 'flex-start',
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        flexShrink: 0,
                        borderRadius: '50%',
                        background: 'var(--ember-tint)',
                        border: '1px solid rgba(232,111,78,0.3)',
                        color: 'var(--ember-deep)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        color: 'var(--ink-soft)',
                        lineHeight: 1.6,
                      }}
                    >
                      {t}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>

        {/* ── Right: preview ──────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            position: 'sticky',
            top: 92,
          }}
        >
          <span className="eyebrow" style={{ margin: 0 }}>
            Live preview
          </span>
          <Reveal>
            <TiltCard max={4} glare={false}>
              <MenuQR restaurant={selected} table={effectiveTable} />
            </TiltCard>
          </Reveal>
        </div>
      </div>

      {/* ── Bulk grid ──────────────────────────────── */}
      {mode === 'bulk' && selected && (
        <div style={{ marginTop: 48 }}>
          <Reveal>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div>
                <span className="eyebrow">Bulk print</span>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 28,
                    fontWeight: 440,
                    letterSpacing: '-0.025em',
                    color: 'var(--ink)',
                    marginTop: 6,
                  }}
                >
                  {bulkTables.length} codes for{' '}
                  <em style={{ color: 'var(--ember-deep)', fontStyle: 'italic', fontWeight: 380 }}>
                    {selected.name}
                  </em>
                </h2>
              </div>
              <MagneticButton
                as="button"
                onClick={() => window.print()}
                className="btn btn-ember btn-arrow"
              >
                Print all
              </MagneticButton>
            </div>
          </Reveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 16,
            }}
          >
            {bulkTables.map((t) => (
              <MenuQR key={t} restaurant={selected} table={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
