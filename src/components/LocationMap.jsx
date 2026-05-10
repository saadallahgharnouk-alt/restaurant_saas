import React, { useEffect, useRef, useState } from 'react';

/**
 * <LocationMap> — an embedded OpenStreetMap (no API key, no billing).
 * We lazy-mount the iframe when it enters the viewport so the rest of
 * the page doesn't wait on map tiles.
 *
 * Props:
 *   lat, lng — coordinates
 *   zoom     — default 15
 *   title    — accessible title
 */
export default function LocationMap({ lat, lng, zoom = 16, title = 'Map' }) {
  const wrapRef = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Bounding box around the point. 0.004° ≈ 400 m — feels right at zoom 16.
  const d = 0.004;
  const bbox = `${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
  const directionsHref = `https://www.openstreetmap.org/directions?to=${lat}%2C${lng}#map=${zoom}/${lat}/${lng}`;

  return (
    <div ref={wrapRef} className="location-map">
      {show ? (
        <iframe
          title={title}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="location-map-frame"
        />
      ) : (
        <div className="location-map-skeleton" aria-hidden="true" />
      )}
      <a
        href={directionsHref}
        target="_blank"
        rel="noopener noreferrer"
        className="location-map-cta"
      >
        Open in Maps →
      </a>
    </div>
  );
}
