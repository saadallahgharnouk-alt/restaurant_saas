import React, { useEffect, useRef, useState } from 'react';

/**
 * <HeroVideo> — full-bleed looping background. Autoplays muted, honours
 * prefers-reduced-motion (shows poster only), and gracefully falls back
 * to an image if the video fails to load.
 *
 * Props:
 *   src      — mp4/webm URL
 *   poster   — poster / fallback image
 *   children — overlay content
 */
export default function HeroVideo({ src, poster, fallbackImage, children }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);

  return (
    <div className="hero-video">
      {failed || reduced || !src ? (
        <img
          src={fallbackImage || poster}
          alt=""
          className="hero-video-el"
          draggable={false}
        />
      ) : (
        <video
          ref={ref}
          className="hero-video-el"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
        />
      )}
      <div className="hero-video-scrim" aria-hidden="true" />
      <div className="hero-video-content">{children}</div>
    </div>
  );
}
