import React, { useState } from 'react';

const CAT_ACCENT = {
  Burgers:  '#f59e0b',
  Pizza:    '#ef4444',
  Pasta:    '#ec4899',
  Salads:   '#22c55e',
  Seafood:  '#38bdf8',
  Desserts: '#a855f7',
};

/**
 * Elegant menu item card. Works for both the admin menu list
 * and the public scan page (pass compact=true to shrink it).
 */
export default function MenuCard({ item, onAddToCart, compact = false }) {
  const [fav, setFav] = useState(false);
  const [adding, setAdding] = useState(false);

  const accent = CAT_ACCENT[item.category] || 'var(--accent)';
  const finalPrice = item.price * (1 - (item.discount || 0) / 100);
  const hasDiscount = (item.discount || 0) > 0;

  const handleAdd = () => {
    setAdding(true);
    onAddToCart?.(item);
    setTimeout(() => setAdding(false), 450);
  };

  return (
    <div
      className="card"
      style={{
        padding: compact ? 14 : 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {hasDiscount && (
        <div style={{
          position: 'absolute', top: 10, right: 10, zIndex: 2,
          background: 'var(--red)', color: '#fff',
          padding: '4px 10px', borderRadius: 99,
          fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.06em',
          boxShadow: '0 6px 16px rgba(239,68,68,0.35)',
        }}>
          -{item.discount}%
        </div>
      )}

      {/* Image */}
      <div style={{
        width: '100%',
        aspectRatio: '16 / 10',
        borderRadius: 12,
        overflow: 'hidden',
        background: 'var(--surface2)',
        border: '1px solid var(--border)',
        position: 'relative',
      }}>
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-mid)',
            letterSpacing: '0.1em',
          }}>
            NO IMAGE
          </div>
        )}

        {/* Category chip on image */}
        {item.category && (
          <span style={{
            position: 'absolute', top: 10, left: 10,
            padding: '3px 10px', borderRadius: 99,
            background: 'rgba(9,9,11,0.7)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${accent}55`,
            color: accent,
            fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>{item.category}</span>
        )}
      </div>

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: compact ? 15 : 16,
          fontWeight: 700,
          color: 'var(--text-hi)',
          letterSpacing: '-0.3px',
          lineHeight: 1.25,
          flex: 1,
        }}>{item.name}</h3>

        <button
          type="button"
          onClick={() => setFav(v => !v)}
          aria-label={fav ? 'Remove from favourites' : 'Add to favourites'}
          style={{
            width: 30, height: 30, borderRadius: 8,
            border: '1px solid var(--border)',
            background: fav ? 'rgba(239,68,68,0.12)' : 'var(--surface2)',
            color: fav ? 'var(--red)' : 'var(--text-mid)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
            transition: 'background 0.2s, color 0.2s',
            flexShrink: 0,
          }}
        >
          {fav ? '♥' : '♡'}
        </button>
      </div>

      {/* Description */}
      {item.description && (
        <p style={{
          color: 'var(--text-mid)',
          fontSize: 12,
          lineHeight: 1.55,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>{item.description}</p>
      )}

      {/* Price + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: compact ? 18 : 20,
            fontWeight: 800,
            color: 'var(--green)',
            letterSpacing: '-0.4px',
          }}>${finalPrice.toFixed(2)}</span>
          {hasDiscount && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text-mid)',
              textDecoration: 'line-through',
            }}>${item.price.toFixed(2)}</span>
          )}
        </div>

        {onAddToCart && (
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-primary btn-sm"
            style={{
              transform: adding ? 'scale(0.92)' : 'scale(1)',
              transition: 'transform 0.2s var(--ease-spring)',
            }}
          >
            {adding ? '✓ Added' : '+ Add'}
          </button>
        )}
      </div>
    </div>
  );
}
