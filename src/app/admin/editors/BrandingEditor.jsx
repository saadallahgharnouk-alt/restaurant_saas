import React, { useState } from "react";
import { useContent } from "../../../lib/content-context.js";
import MediaUpload from "../../../components/MediaUpload";

/* ───────────────────────────────────────────────────────────────
   Branding Editor (Req 7)
   Fields: restaurantName, tagline, logoUrl
   Validation inline, save triggers Content_Store persist.
   ─────────────────────────────────────────────────────────────── */

export default function BrandingEditor() {
  const { content, updateContent, saveContent, status } = useContent();
  const { restaurantName: name = "", tagline = "", logoUrl = "" } = content?.branding ?? {};
  const [errors, setErrors] = useState({});

  // Validation
  function validate() {
    const errs = {};
    if (name.length < 1) errs.restaurantName = "Name must be at least 1 character.";
    else if (name.length > 80) errs.restaurantName = "Name must be at most 80 characters.";

    if (tagline.length > 160) errs.tagline = "Tagline must be at most 160 characters.";

    if (logoUrl !== "") {
      if (!logoUrl.startsWith("https://") && !/^data:image\/[^;]+;base64,/.test(logoUrl)) {
        errs.logoUrl = "Logo must be empty, an https:// URL, or a data:image/*;base64,… string.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleChange(field, value) {
    updateContent(`branding.${field}`, value);
    // Clear field error on change
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSave() {
    if (!validate()) return;
    await saveContent();
  }

  if (!content) {
    return <div className="loading-spinner" />;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500, color: "var(--fg)", letterSpacing: "-0.02em" }}>
            Branding
          </h2>
          <p style={{ fontSize: 14, color: "var(--fg-mid)", marginTop: 4 }}>
            Your restaurant's name, tagline, and logo.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-ember btn-sm"
          onClick={handleSave}
          disabled={status === "saving"}
        >
          {status === "saving" ? "Saving…" : "Save"}
        </button>
      </div>

      {/* Restaurant Name */}
      <FieldGroup id="restaurant-name" label="Restaurant Name" error={errors.restaurantName} charCount={`${name.length}/80`}>
        <input
          id="restaurant-name"
          className="input"
          type="text"
          value={name}
          onChange={(e) => handleChange("restaurantName", e.target.value)}
          maxLength={80}
          placeholder="e.g. Dar Zellij"
        />
      </FieldGroup>

      {/* Tagline */}
      <FieldGroup id="restaurant-tagline" label="Tagline" error={errors.tagline} charCount={`${tagline.length}/160`}>
        <input
          id="restaurant-tagline"
          className="input"
          type="text"
          value={tagline}
          onChange={(e) => handleChange("tagline", e.target.value)}
          maxLength={160}
          placeholder="e.g. Modern Moroccan Kitchen"
        />
      </FieldGroup>

      {/* Logo */}
      <FieldGroup id="restaurant-logo" label="Logo" error={errors.logoUrl}>
        <input
          id="restaurant-logo"
          className="input"
          type="text"
          value={logoUrl}
          onChange={(e) => handleChange("logoUrl", e.target.value)}
          placeholder="https://... or upload below"
        />
        <MediaUpload
          value={logoUrl}
          onChange={(url) => handleChange("logoUrl", url)}
          label="Upload logo"
        />
      </FieldGroup>
    </div>
  );
}

/* ─── Shared field wrapper ────────────────────────────────────────────────── */

function FieldGroup({ id, label, error, charCount, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <label
          htmlFor={id}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--fg-faint)",
          }}
        >
          {label}
        </label>
        {charCount && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--fg-muted)",
            }}
          >
            {charCount}
          </span>
        )}
      </div>
      {children}
      {error && (
        <div
          role="alert"
          style={{
            marginTop: 6,
            fontSize: 12,
            color: "var(--ember)",
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
