import React, { useState, useEffect, useCallback } from "react";
import { useContent } from "../../../lib/content-store";

/* ───────────────────────────────────────────────────────────────
   Landing Editor (Req 8)
   Fields: heroHeadline, heroLead, heroImageUrl, marqueeItems, features[]
   ─────────────────────────────────────────────────────────────── */

export default function LandingEditor() {
  const { content, updateContent, saveContent, status } = useContent();
  const landing = content?.landing;

  const [local, setLocal] = useState(null);
  const [errors, setErrors] = useState({});

  // Sync from store
  useEffect(() => {
    if (landing) {
      setLocal(structuredClone(landing));
    }
  }, [landing]);

  const set = useCallback((path, value) => {
    setLocal((prev) => {
      const next = structuredClone(prev);
      setNestedValue(next, path, value);
      return next;
    });
    updateContent(`landing.${path}`, value);
    setErrors((prev) => {
      const next = { ...prev };
      delete next[path];
      return next;
    });
  }, [updateContent]);

  function validate() {
    if (!local) return false;
    const errs = {};

    if (!local.heroHeadline || local.heroHeadline.length < 4)
      errs.heroHeadline = "Must be at least 4 characters.";
    else if (local.heroHeadline.length > 140)
      errs.heroHeadline = "Must be at most 140 characters.";

    if (!local.heroLead || local.heroLead.length < 20)
      errs.heroLead = "Must be at least 20 characters.";
    else if (local.heroLead.length > 400)
      errs.heroLead = "Must be at most 400 characters.";

    if (!local.marqueeItems || local.marqueeItems.length < 1)
      errs.marqueeItems = "At least 1 marquee item is required.";

    if (!local.features || local.features.length < 3)
      errs.features = "At least 3 feature rows are required.";
    else if (local.features.length > 6)
      errs.features = "At most 6 feature rows are allowed.";

    if (local.features) {
      local.features.forEach((f, i) => {
        if (!f.title || f.title.trim() === "")
          errs[`features[${i}].title`] = `Feature ${i + 1}: title is required.`;
        if (!f.body || f.body.trim() === "")
          errs[`features[${i}].body`] = `Feature ${i + 1}: body is required.`;
      });
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    await saveContent();
  }

  if (!local) return <div className="loading-spinner" />;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500, color: "var(--fg)" }}>
            Landing Page
          </h2>
          <p style={{ fontSize: 14, color: "var(--fg-mid)", marginTop: 4 }}>
            Hero content, marquee, and feature sections.
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

      {/* Hero Headline */}
      <Field
        label="Hero Headline"
        error={errors.heroHeadline}
        charCount={`${(local.heroHeadline || "").length}/140`}
      >
        <input
          className="input"
          value={local.heroHeadline || ""}
          onChange={(e) => set("heroHeadline", e.target.value)}
          maxLength={140}
          placeholder="e.g. Flavors of Morocco, served with soul."
        />
      </Field>

      {/* Hero Lead */}
      <Field
        label="Hero Lead Paragraph"
        error={errors.heroLead}
        charCount={`${(local.heroLead || "").length}/400`}
      >
        <textarea
          className="input"
          value={local.heroLead || ""}
          onChange={(e) => set("heroLead", e.target.value)}
          maxLength={400}
          rows={3}
          style={{ resize: "vertical", minHeight: 80 }}
          placeholder="A short paragraph describing your restaurant…"
        />
      </Field>

      {/* Hero Image URL */}
      <Field label="Hero Image URL" error={errors.heroImageUrl}>
        <input
          className="input"
          value={local.heroImageUrl || ""}
          onChange={(e) => set("heroImageUrl", e.target.value)}
          placeholder="https://images.unsplash.com/..."
        />
        {local.heroImageUrl && (
          <img
            src={local.heroImageUrl}
            alt="Hero preview"
            style={{ marginTop: 10, maxWidth: 200, maxHeight: 120, borderRadius: 10, objectFit: "cover", border: "1px solid var(--rule)" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        )}
      </Field>

      <Divider />

      {/* Marquee Items */}
      <Field label="Marquee Items" error={errors.marqueeItems}>
        <p style={{ fontSize: 12, color: "var(--fg-faint)", marginBottom: 10 }}>
          Scrolling text items on the landing page. At least 1 required.
        </p>
        <ListEditor
          items={local.marqueeItems || []}
          onChange={(items) => set("marqueeItems", items)}
          placeholder="e.g. Tagine"
          maxItems={20}
        />
      </Field>

      <Divider />

      {/* Feature Rows */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-faint)" }}>
            Feature Rows ({local.features?.length || 0}/6)
          </label>
          {(local.features?.length || 0) < 6 && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                const newFeature = { eyebrow: "", title: "", body: "", bullets: [], ctaLabel: "", ctaHref: "", imageUrl: "" };
                set("features", [...(local.features || []), newFeature]);
              }}
            >
              + Add Row
            </button>
          )}
        </div>
        {errors.features && <ErrorText>{errors.features}</ErrorText>}
      </div>

      {(local.features || []).map((feature, i) => (
        <FeatureRowEditor
          key={i}
          index={i}
          feature={feature}
          errors={errors}
          onChange={(updated) => {
            const features = [...local.features];
            features[i] = updated;
            set("features", features);
          }}
          onRemove={() => {
            if ((local.features || []).length <= 3) return;
            const features = local.features.filter((_, idx) => idx !== i);
            set("features", features);
          }}
          onMoveUp={() => {
            if (i === 0) return;
            const features = [...local.features];
            [features[i - 1], features[i]] = [features[i], features[i - 1]];
            set("features", features);
          }}
          onMoveDown={() => {
            if (i >= (local.features || []).length - 1) return;
            const features = [...local.features];
            [features[i], features[i + 1]] = [features[i + 1], features[i]];
            set("features", features);
          }}
          canRemove={(local.features || []).length > 3}
        />
      ))}
    </div>
  );
}

/* ─── Feature Row Sub-Editor ──────────────────────────────────────────────── */

function FeatureRowEditor({ index, feature, errors, onChange, onRemove, onMoveUp, onMoveDown, canRemove }) {
  const up = (field, value) => onChange({ ...feature, [field]: value });

  return (
    <div
      style={{
        padding: 20,
        marginBottom: 16,
        background: "var(--surface-2, #1C1C22)",
        border: "1px solid var(--rule)",
        borderRadius: 14,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)", letterSpacing: "0.1em" }}>
          FEATURE {index + 1}
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          <MiniBtn onClick={onMoveUp} title="Move up">↑</MiniBtn>
          <MiniBtn onClick={onMoveDown} title="Move down">↓</MiniBtn>
          {canRemove && <MiniBtn onClick={onRemove} title="Remove" danger>×</MiniBtn>}
        </div>
      </div>

      <SmallField label="Eyebrow">
        <input className="input" value={feature.eyebrow || ""} onChange={(e) => up("eyebrow", e.target.value)} placeholder="e.g. Our Menu" />
      </SmallField>

      <SmallField label="Title" error={errors[`features[${index}].title`]}>
        <input className="input" value={feature.title || ""} onChange={(e) => up("title", e.target.value)} placeholder="Required" />
      </SmallField>

      <SmallField label="Body" error={errors[`features[${index}].body`]}>
        <textarea className="input" value={feature.body || ""} onChange={(e) => up("body", e.target.value)} rows={2} style={{ resize: "vertical", minHeight: 56 }} placeholder="Required" />
      </SmallField>

      <SmallField label="Bullets (up to 4)">
        <BulletsEditor
          bullets={feature.bullets || []}
          onChange={(bullets) => up("bullets", bullets)}
        />
      </SmallField>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <SmallField label="CTA Label">
          <input className="input" value={feature.ctaLabel || ""} onChange={(e) => up("ctaLabel", e.target.value)} placeholder="Optional" />
        </SmallField>
        <SmallField label="CTA Link">
          <input className="input" value={feature.ctaHref || ""} onChange={(e) => up("ctaHref", e.target.value)} placeholder="/menu or https://..." />
        </SmallField>
      </div>

      <SmallField label="Image URL">
        <input className="input" value={feature.imageUrl || ""} onChange={(e) => up("imageUrl", e.target.value)} placeholder="https://..." />
      </SmallField>
    </div>
  );
}

/* ─── Bullets Sub-Editor ──────────────────────────────────────────────────── */

function BulletsEditor({ bullets, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {bullets.map((b, i) => (
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            className="input"
            value={b.strong || ""}
            onChange={(e) => {
              const next = [...bullets];
              next[i] = { ...next[i], strong: e.target.value };
              onChange(next);
            }}
            placeholder="Bold part"
            style={{ flex: "0 0 140px" }}
          />
          <input
            className="input"
            value={b.rest || ""}
            onChange={(e) => {
              const next = [...bullets];
              next[i] = { ...next[i], rest: e.target.value };
              onChange(next);
            }}
            placeholder="Rest of text"
            style={{ flex: 1 }}
          />
          <MiniBtn onClick={() => onChange(bullets.filter((_, idx) => idx !== i))} danger title="Remove">×</MiniBtn>
        </div>
      ))}
      {bullets.length < 4 && (
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          style={{ alignSelf: "flex-start", fontSize: 12 }}
          onClick={() => onChange([...bullets, { strong: "", rest: "" }])}
        >
          + Bullet
        </button>
      )}
    </div>
  );
}

/* ─── Marquee List Editor ─────────────────────────────────────────────────── */

function ListEditor({ items, onChange, placeholder, maxItems = 20 }) {
  const [draft, setDraft] = useState("");

  function add() {
    const val = draft.trim();
    if (!val || items.length >= maxItems) return;
    onChange([...items, val]);
    setDraft("");
  }

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              background: "var(--surface-2)",
              border: "1px solid var(--rule)",
              borderRadius: 99,
              fontSize: 13,
              color: "var(--fg-mid)",
            }}
          >
            {item}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              style={{ background: "none", border: "none", color: "var(--fg-faint)", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0 }}
              title="Remove"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      {items.length < maxItems && (
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
            placeholder={placeholder}
            style={{ flex: 1 }}
          />
          <button type="button" className="btn btn-ghost btn-sm" onClick={add}>Add</button>
        </div>
      )}
    </div>
  );
}

/* ─── Shared Helpers ──────────────────────────────────────────────────────── */

function Field({ label, error, charCount, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <label style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-faint)" }}>
          {label}
        </label>
        {charCount && <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-muted)" }}>{charCount}</span>}
      </div>
      {children}
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function SmallField({ label, error, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-faint)", marginBottom: 4 }}>
        {label}
      </label>
      {children}
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ children }) {
  return <div role="alert" style={{ marginTop: 4, fontSize: 12, color: "var(--ember)", fontWeight: 500 }}>{children}</div>;
}

function MiniBtn({ onClick, title, danger, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        width: 26,
        height: 26,
        borderRadius: 8,
        border: "1px solid var(--rule)",
        background: "transparent",
        color: danger ? "var(--ember)" : "var(--fg-faint)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        lineHeight: 1,
        transition: "background 0.15s",
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div style={{ borderTop: "1px solid var(--rule)", margin: "28px 0" }} />;
}

/* ─── Deep set utility ────────────────────────────────────────────────────── */

function setNestedValue(obj, path, value) {
  const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = /^\d+$/.test(keys[i]) ? Number(keys[i]) : keys[i];
    if (current[key] === undefined) current[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
    current = current[key];
  }
  const lastKey = /^\d+$/.test(keys[keys.length - 1]) ? Number(keys[keys.length - 1]) : keys[keys.length - 1];
  current[lastKey] = value;
}
