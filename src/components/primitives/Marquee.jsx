import React from 'react';

/**
 * <Marquee> — infinite horizontal scroll. Duplicates children so the loop
 * is seamless; CSS animation does the work.
 */
export default function Marquee({ items = [], className = '' }) {
  return (
    <div className={`landing-marquee ${className}`.trim()}>
      <div className="marquee-track">
        {items.concat(items).map((it, i) => (
          <span key={i} className="m-item">{it}</span>
        ))}
      </div>
    </div>
  );
}
