import React, { useEffect, useRef } from 'react';

/**
 * <Reveal> — fades + rises its children once they enter the viewport.
 * Uses IntersectionObserver so it's effectively free on the main thread.
 *
 * Props:
 *   as        — element tag (default "div")
 *   stagger   — if true, sequentially animates direct children instead
 *   threshold — IO threshold (default 0.15)
 *   className — extra classes appended
 */
export default function Reveal({
  as: Tag = 'div',
  stagger = false,
  threshold = 0.15,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      el.classList.add('in');
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in');
          io.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  const base = stagger ? 'stagger' : 'reveal';
  const cls = `${base} ${className}`.trim();

  return (
    <Tag ref={ref} className={cls} {...rest}>
      {children}
    </Tag>
  );
}
