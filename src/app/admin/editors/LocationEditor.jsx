import React, { useState, useEffect, useRef } from "react";
import { useContent } from "../../../lib/content-store";

/* ───────────────────────────────────────────────────────────────
   Location & Map Editor (Req 9)
   Fields: address, latitude, longitude, embedUrl
   Live map preview, "Copy generated embed URL" button.
   ─────────────────────────────────────────────────────────────── */

const EMBED_PATTERN = /^https:\/\/www\.google\.com\/maps\/embed\?/;

export default function LocationEditor() {
  const { content, updateContent, saveContent, status } = useContent();
  const location = content?.location;

  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [errors, setErrors] = useState({});
  const previewTimer = useRef(null);
  const [previewSrc, setPreviewSrc] = useState("");

  // Sync from store
  useEffect(() => {
    if (location) {
      setAddress(location.address || "");
      setLat(location.latitude != null ? String(location.latitude) : "");
      setLng(location.longitude != null ? String(location.longitude) : "");
      setEmbedUrl(location.embedUrl || "");
    }
  }, [location]);

  // Live preview — debounced 500ms
  useEffect(() => {
    if (previewTimer.current) clearTimeout(previewTimer.current);
    previewTimer.current = setTimeout(() => {
      setPreviewSrc(computePreviewSrc(embedUrl, lat, lng));
    }, 500);
    return () => clearTimeout(previewTimer.current);
  }, [embedUrl, lat, lng]);

  function computePreviewSrc(embed, latitude, longitude) {
    // If embedUrl is valid, use it
    if (embed && EMBED_PATTERN.test(embed)) return embed;
    // Otherwise derive from lat/lng
    const la = parseFloat(latitude);
    const ln = parseFloat(longitude);
    if (isValidLat(la) && isValidLng(ln)) {
      return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d${ln}!3d${la}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sma!4v1`;
    }
    // Fallback: Morocco overview
    return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000000!2d-7.0926!3d31.7917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sma!4v1`;
  }

  function isValidLat(v) { return typeof v === "number" && !isNaN(v) && v >= -90 && v <= 90; }
  function isValidLng(v) { return typeof v === "number" && !isNaN(v) && v >= -180 && v <= 180; }

  function handleChange(field, value) {
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });

    if (field === "address") {
      setAddress(value);
      updateContent("location.address", value);
    } else if (field === "latitude") {
      setLat(value);
      const num = value === "" ? null : parseFloat(value);
      if (value !== "" && (isNaN(num) || num < -90 || num > 90)) return; // don't update store with invalid
      updateContent("location.latitude", num);
    } else if (field === "longitude") {
      setLng(value);
      const num = value === "" ? null : parseFloat(value);
      if (value !== "" && (isNaN(num) || num < -180 || num > 180)) return;
      updateContent("location.longitude", num);
    } else if (field === "embedUrl") {
      setEmbedUrl(value);
      updateContent("location.embedUrl", value);
    }
  }

  function validate() {
    const errs = {};
    if (lat !== "") {
      const num = parseFloat(lat);
      if (isNaN(num) || num < -90 || num > 90)
        errs.latitude = "Must be between -90 and 90.";
    }
    if (lng !== "") {
      const num = parseFloat(lng);
      if (isNaN(num) || num < -180 || num > 180)
        errs.longitude = "Must be between -180 and 180.";
    }
    if (embedUrl && !EMBED_PATTERN.test(embedUrl))
      errs.embedUrl = "Must be empty or start with https://www.google.com/maps/embed?";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    await saveContent();
  }

  function generateEmbedUrl() {
    const la = parseFloat(lat);
    const ln = parseFloat(lng);
    if (!isValidLat(la) || !isValidLng(ln)) return;
    const generated = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d${ln}!3d${la}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sma!4v1`;
    setEmbedUrl(generated);
    updateContent("location.embedUrl", generated);
  }

  if (!content) return <div className="loading-spinner" />;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500, color: "var(--fg)" }}>
            Location & Map
          </h2>
          <p style={{ fontSize: 14, color: "var(--fg-mid)", marginTop: 4 }}>
            Set your venue address and map pin coordinates.
          </p>
        </div>
        <button type="button" className="btn btn-ember btn-sm" onClick={handleSave} disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Save"}
        </button>
      </div>

      {/* Address */}
      <Field label="Address" error={errors.address}>
        <input
          className="input"
          value={address}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="e.g. 12 Rue Mohamed V, Casablanca, Morocco"
        />
      </Field>

      {/* Lat / Lng */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <Field label="Latitude (-90 to 90)" error={errors.latitude}>
          <input
            className="input"
            type="number"
            step="any"
            value={lat}
            onChange={(e) => handleChange("latitude", e.target.value)}
            placeholder="33.5731"
          />
        </Field>
        <Field label="Longitude (-180 to 180)" error={errors.longitude}>
          <input
            className="input"
            type="number"
            step="any"
            value={lng}
            onChange={(e) => handleChange("longitude", e.target.value)}
            placeholder="-7.5898"
          />
        </Field>
      </div>

      {/* Embed URL */}
      <Field label="Google Maps Embed URL" error={errors.embedUrl}>
        <input
          className="input"
          value={embedUrl}
          onChange={(e) => handleChange("embedUrl", e.target.value)}
          placeholder="https://www.google.com/maps/embed?pb=..."
        />
        <div style={{ marginTop: 8, display: "flex", gap: 10 }}>
          {lat && lng && !embedUrl && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={generateEmbedUrl}>
              Generate embed URL from coordinates
            </button>
          )}
          {embedUrl && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => { navigator.clipboard?.writeText(embedUrl); }}
            >
              Copy URL
            </button>
          )}
        </div>
      </Field>

      {/* Live Map Preview */}
      <div style={{ marginTop: 8 }}>
        <label style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-faint)", display: "block", marginBottom: 8 }}>
          Map Preview
        </label>
        <div
          style={{
            width: "100%",
            aspectRatio: "16/9",
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid var(--rule)",
            background: "var(--surface-2)",
          }}
        >
          {previewSrc ? (
            <iframe
              src={previewSrc}
              title={address || "Restaurant location map"}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--fg-faint)", fontSize: 13 }}>
              Enter coordinates or an embed URL to see a preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Shared Field ────────────────────────────────────────────────────────── */

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 0 }}>
      <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-faint)", marginBottom: 6 }}>
        {label}
      </label>
      {children}
      {error && <div role="alert" style={{ marginTop: 4, fontSize: 12, color: "var(--ember)", fontWeight: 500 }}>{error}</div>}
    </div>
  );
}
