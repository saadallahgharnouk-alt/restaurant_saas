import React, { useEffect, useRef } from 'react';

/**
 * <HeroCanvas> — a warm, organic particle field that reacts to pointer
 * motion. No WebGL, no Spline, no external libs — just 2D canvas and a
 * forces simulation. Feels like suspended ember embers over paper.
 *
 * Particles are drawn as soft coral dots connected by thin lines when
 * close; pointer proximity adds a gentle attraction.
 *
 * Props:
 *   density — particle count (default 52)
 */
export default function HeroCanvas({ density = 52, className = '' }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const particlesRef = useRef([]);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const { offsetWidth: w, offsetHeight: h } = canvas;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // init particles
    const rand = (min, max) => Math.random() * (max - min) + min;
    particlesRef.current = Array.from({ length: density }, () => ({
      x: rand(0, canvas.offsetWidth),
      y: rand(0, canvas.offsetHeight),
      vx: rand(-0.18, 0.18),
      vy: rand(-0.18, 0.18),
      r: rand(0.8, 2.6),
      glow: rand(0.35, 0.9),
      hueShift: rand(-18, 18),
    }));

    const ember = [232, 111, 78]; // coral rgb

    // reduced motion → static render, no rAF
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const step = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const ps = particlesRef.current;
      const pointer = pointerRef.current;

      // update
      for (const p of ps) {
        // gentle pointer attraction
        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 180 * 180) {
            const f = (1 - Math.sqrt(d2) / 180) * 0.04;
            p.vx += dx * f * 0.01;
            p.vy += dy * f * 0.01;
          }
        }
        p.x += p.vx;
        p.y += p.vy;

        // damping
        p.vx *= 0.985;
        p.vy *= 0.985;

        // wrap
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      // connections
      ctx.lineWidth = 0.6;
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i];
          const b = ps[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 120 * 120) {
            const alpha = (1 - Math.sqrt(d2) / 120) * 0.22;
            ctx.strokeStyle = `rgba(28,24,20,${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // particles
      for (const p of ps) {
        const [r, g, bcol] = ember;
        // outer glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        grad.addColorStop(0, `rgba(${r},${g},${bcol},${0.28 * p.glow})`);
        grad.addColorStop(1, `rgba(${r},${g},${bcol},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fill();

        // solid core
        ctx.fillStyle = `rgba(${r},${g},${bcol},0.9)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReduced) rafRef.current = requestAnimationFrame(step);
    };

    if (prefersReduced) {
      step(); // one static frame
    } else {
      rafRef.current = requestAnimationFrame(step);
    }

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: e.clientX - r.left,
        y: e.clientY - r.top,
        active: true,
      };
    };
    const onLeave = () => {
      pointerRef.current.active = false;
    };

    // attach to a surrounding element — use window for a broad hover field
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseout', onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
      ro.disconnect();
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}
