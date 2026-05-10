import React, { useEffect, useRef, useState } from 'react';

/**
 * <AnimatedNumber> — counts up from 0 to `value` when scrolled into view.
 * Supports prefixes/suffixes and formatting.
 *
 * Props:
 *   value    — target number
 *   prefix   — e.g. "$"
 *   suffix   — e.g. "%", "+"
 *   duration — ms, default 1600
 *   decimals — decimal places, default 0
 */
export default function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  duration = 1600,
  decimals = 0,
  format = null,
}) {
  const [n, setN] = useState(0);
  const nodeRef = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setN(value);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const start = performance.now();
        const from = 0;
        const to = value;
        const tick = (t) => {
          const p = Math.min(1, (t - start) / duration);
          // ease-out-expo
          const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          setN(from + (to - from) * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.unobserve(el);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  let display;
  if (format) {
    display = format(n);
  } else if (decimals > 0) {
    display = n.toFixed(decimals);
  } else {
    display = Math.round(n).toLocaleString();
  }

  return (
    <span ref={nodeRef}>
      {prefix}{display}{suffix}
    </span>
  );
}
