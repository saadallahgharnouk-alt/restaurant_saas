import React, { useCallback, useRef } from 'react';

/**
 * <TiltCard> — 3D pointer-tracking tilt. Gives cards real parallax depth
 * without a library. Children are wrapped in a perspective container, so
 * any nested element with `data-depth="N"` will translate on the Z axis.
 *
 * Props:
 *   as        — tag (default "div")
 *   max       — max rotation angle in degrees (default 8)
 *   glare     — show a specular highlight that follows the cursor (default true)
 *   className — forwarded
 */
export default function TiltCard({
  as: Tag = 'div',
  max = 8,
  glare = true,
  className = '',
  children,
  ...rest
}) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const glareRef = useRef(null);
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );

  const onMove = useCallback(
    (e) => {
      if (reducedMotion.current) return;
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner) return;
      const r = outer.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (0.5 - py) * max * 2;
      const ry = (px - 0.5) * max * 2;
      inner.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      if (glareRef.current) {
        glareRef.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.22), transparent 60%)`;
      }
    },
    [max]
  );

  const onLeave = useCallback(() => {
    if (reducedMotion.current) return;
    const inner = innerRef.current;
    if (!inner) return;
    inner.style.transform = '';
    if (glareRef.current) glareRef.current.style.background = 'transparent';
  }, []);

  return (
    <Tag
      ref={outerRef}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ perspective: '1200px' }}
      {...rest}
    >
      <div
        ref={innerRef}
        data-tilt
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.45s var(--ease-out)',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        {children}
        {glare && (
          <span
            ref={glareRef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              borderRadius: 'inherit',
              mixBlendMode: 'overlay',
              transition: 'background 0.25s linear',
            }}
          />
        )}
      </div>
    </Tag>
  );
}
