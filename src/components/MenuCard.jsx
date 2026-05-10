import React, { useState } from 'react';
import { TiltCard } from './primitives';

const CAT_ACCENT = {
  Burgers:  '#D4932E',
  Pizza:    '#B13D2A',
  Pasta:    '#6B3D5C',
  Salads:   '#6B8E5A',
  Seafood:  '#4A7A8C',
  Desserts: '#8B5A7A',
};

/**
 * Elegant menu item card on cream paper. Works for both the admin menu
 * list and the public scan page (pass compact=true to shrink it).
 */
export default function MenuCard({ item, onAddToCart, compact = false }) {
  const [fav, setFav]     = useState(false);
  const [adding, setAdding] = useState(false);

  const accent = CAT_ACCENT[item.category] || 'var(--ember-deep)';
  const finalPrice = item.price * (1 - (item.discount || 0) / 100);
  const hasDiscount = (item.discount || 0) > 0;

  const handleAdd = () => {
    setAdding(true);
    onAddToCart?.(item);
    setTimeout(() => setAdding(false), 450);
  };

  return (
    <TiltCard
      className="card"
      max={5}
      glare={false}
    >
      <div
        style={{
          padding: compact ? 14 : 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {hasDiscount && (
          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 2,
              background: 'var(--ember)',
              color: 'var(--paper-mist)',
              padding: '4px 12px',
              borderRadius: 99,
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.06em',
              boxShadow: '0 6px 16px rgba(232,111,78,0.4)',
            }}
          >
            -{item.discount}%
          </div>
        )}

        {/* Image */}
        <div
          style={{
            width: '100%',
            aspectRatio: '16 / 10',
            borderRadius: 14,
            overflow: 'hidden',
            background: 'var(--paper-soft)',
            border: '1px solid var(--rule)',
            position: 'relative',
          }}
        >
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 1.2s var(--ease-out)',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = 'scale(1.05)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = 'scale(1)')
              }
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--ink-faint)',
                letterSpacing: '0.1em',
              }}
            >
              NO IMAGE
            </div>
          )}

          {item.category && (
            <span
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                padding: '4px 12px',
                borderRadius: 99,
                background: 'var(--paper-mist)',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${accent}55`,
                color: accent,
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {item.category}
            </span>
          )}
        </div>

        {/* Header row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: compact ? 17 : 19,
              fontWeight: 500,
              color: 'var(--ink)',
              letterSpacing: '-0.018em',
              lineHeight: 1.2,
              flex: 1,
            }}
          >
            {item.name}
          </h3>

          <button
            type="button"
            onClick={() => setFav((v) => !v)}
            aria-label={fav ? 'Remove from favourites' : 'Add to favourites'}
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              border: '1px solid var(--rule)',
              background: fav ? 'var(--ember-tint)' : 'var(--paper-soft)',
              color: fav ? 'var(--ember-deep)' : 'var(--ink-faint)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              transition: 'background 0.2s, color 0.2s, transform 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = 'scale(1.08)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = 'scale(1)')
            }
          >
            {fav ? '♥' : '♡'}
          </button>
        </div>

        {item.description && (
          <p
            style={{
              color: 'var(--ink-mid)',
              fontSize: 13,
              lineHeight: 1.55,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {item.description}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            marginTop: 'auto',
            paddingTop: 6,
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: compact ? 20 : 24,
                fontWeight: 500,
                color: 'var(--ember-deep)',
                letterSpacing: '-0.025em',
              }}
            >
              ${finalPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--ink-faint)',
                  textDecoration: 'line-through',
                }}
              >
                ${item.price.toFixed(2)}
              </span>
            )}
          </div>

          {onAddToCart && (
            <button
              type="button"
              onClick={handleAdd}
              className="btn btn-ember btn-sm"
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
    </TiltCard>
  );
}
