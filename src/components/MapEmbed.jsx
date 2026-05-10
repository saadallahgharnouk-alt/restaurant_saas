import React from "react";

/* ───────────────────────────────────────────────────────────────
   MapEmbed (Req 1)
   Renders a Google Maps iframe from CMS location data.
   - Uses embedUrl when valid pattern
   - Falls back to lat/lng derived URL
   - Falls back to Morocco overview
   ─────────────────────────────────────────────────────────────── */

const EMBED_PATTERN = /^https:\/\/www\.google\.com\/maps\/embed\?/;
const MOROCCO_DEFAULT = { lat: 31.7917, lng: -7.0926, zoom: 6 };

function isValidLat(v) { return typeof v === "number" && v >= -90 && v <= 90; }
function isValidLng(v) { return typeof v === "number" && v >= -180 && v <= 180; }

export default function MapEmbed({ location }) {
  const lat = location?.latitude;
  const lng = location?.longitude;
  const address = location?.address;
  const embedUrl = location?.embedUrl;

  const hasValidCoords = isValidLat(lat) && isValidLng(lng);

  // Determine iframe src
  let src;
  if (embedUrl && EMBED_PATTERN.test(embedUrl)) {
    src = embedUrl;
  } else {
    if (embedUrl && !EMBED_PATTERN.test(embedUrl)) {
      console.warn("[MapEmbed] Invalid CMS_Content.location.embedUrl — falling back to coordinates.", embedUrl);
    }
    if (hasValidCoords) {
      src = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sma!4v1`;
    } else {
      src = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000000!2d${MOROCCO_DEFAULT.lng}!3d${MOROCCO_DEFAULT.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sma!4v1`;
    }
  }

  const iframeTitle = address && address.trim() ? address : "Restaurant location map";

  return (
    <div>
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid var(--rule, rgba(255,255,255,0.07))",
        }}
      >
        <iframe
          src={src}
          title={iframeTitle}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      </div>

      {/* Address label */}
      {address && address.trim() && (
        <p style={{ marginTop: 10, fontSize: 14, color: "var(--fg-mid, #A5A2A0)" }}>
          {address}
        </p>
      )}

      {/* Get directions link */}
      {hasValidCoords && (
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginTop: 10,
            fontSize: 13,
            fontWeight: 500,
            color: "var(--ember, #FF6B1F)",
            textDecoration: "none",
          }}
        >
          Get directions &rarr;
        </a>
      )}
    </div>
  );
}
