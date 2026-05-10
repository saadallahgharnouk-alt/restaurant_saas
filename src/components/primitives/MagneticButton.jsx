import React, { useCallback, useRef } from 'react';

/**
 * <MagneticButton> — a button/link that subtly pulls toward the cursor.
 * Lightweight: no framer-motion, just transform + rAF-free transitions.
 *
 * Usage:
 *   <MagneticButton as={Link} to="/qr" className="btn btn-ember">
 *     Generate QR
 *   </MagneticButton>
 *
 * Props:
 *   as       — element (default "button"). Can be Link, "a", etc.
 *   strength — px offset at the edge (default 14)
 *   children — label
 *   ...rest  — passed to the underlying element
 */
export default function MagneticButton({
  as: Tag = 'button',
  strength = 14,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null);
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );

  const onMove = useCallback(
    (e) => {
      if (reducedMotion.current) return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      const nx = Math.max(-1, Math.min(1, x / (r.width / 2)));
      const ny = Math.max(-1, Math.min(1, y / (r.height / 2)));
      el.style.transform = `translate(${nx * strength}px, ${ny * strength}px)`;
    },
    [strength]
  );

  const onLeave = useCallback(() => {
    if (reducedMotion.current) return;
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: 'transform 0.35s var(--ease-out)' }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
