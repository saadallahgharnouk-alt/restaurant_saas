import React, { useState, useEffect } from "react";
import { useContent } from "../../../lib/content-store";

/* ───────────────────────────────────────────────────────────────
   Contact Channels Editor (Req 10)
   Fields: phoneNumber, whatsappNumber, whatsappGreeting,
           whatsappCtaLabel, hours[7]
   ─────────────────────────────────────────────────────────────── */

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function digitCount(str) {
  return (str || "").replace(/\D/g, "").length;
}

/** Normalize WhatsApp number: if starts with 0, prepend +212 (Morocco default) */
function normalizeWhatsApp(raw) {
  const digits = (raw || "").replace(/\D/g, "");
  if (!digits) return raw;
  if (raw.trim().startsWith("0") && !raw.trim().startsWith("+")) {
    return `+212${digits.slice(1)}`;
  }
  if (!raw.trim().startsWith("+")) {
    return `+${digits}`;
  }
  return raw.trim();
}

export default function ContactEditor() {
  const { content, updateContent, saveContent, status } = useContent();
  const contact = content?.contact;

  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [greeting, setGreeting] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [hours, setHours] = useState([]);
  const [errors, setErrors] = useState({});

  // Sync from store
  useEffect(() => {
    if (contact) {
      setPhone(contact.phoneNumber || "");
      setWhatsapp(contact.whatsappNumber || "");
      setGreeting(contact.whatsappGreeting || "");
      setCtaLabel(contact.whatsappCtaLabel || "");
      setHours(
        contact.hours && contact.hours.length === 7
          ? structuredClone(contact.hours)
          : DAYS.map((day) => ({ day, open: "11:00", close: "23:00", closed: false }))
      );
    }
  }, [contact]);

  function clearError(field) {
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  }

  function handlePhoneChange(value) {
    setPhone(value);
    updateContent("contact.phoneNumber", value);
    clearError("phone");
  }

  function handleWhatsappChange(value) {
    setWhatsapp(value);
    clearError("whatsapp");
    // Don't normalize on every keystroke — only on blur
  }

  function handleWhatsappBlur() {
    const normalized = normalizeWhatsApp(whatsapp);
    setWhatsapp(normalized);
    updateContent("contact.whatsappNumber", normalized);
  }

  function handleGreetingChange(value) {
    setGreeting(value);
    updateContent("contact.whatsappGreeting", value);
    clearError("greeting");
  }

  function handleCtaLabelChange(value) {
    setCtaLabel(value);
    updateContent("contact.whatsappCtaLabel", value);
  }

  function handleHourChange(index, field, value) {
    const updated = [...hours];
    updated[index] = { ...updated[index], [field]: value };
    setHours(updated);
    updateContent("contact.hours", updated);
    clearError(`hours[${index}]`);
  }

  function validate() {
    const errs = {};
    const phoneDigits = digitCount(phone);
    if (phone && (phoneDigits < 8 || phoneDigits > 15))
      errs.phone = "Phone must have 8-15 digits.";

    const waDigits = digitCount(whatsapp);
    if (whatsapp && (waDigits < 8 || waDigits > 15))
      errs.whatsapp = "WhatsApp number must have 8-15 digits.";

    if (greeting.length > 280)
      errs.greeting = "Greeting must be at most 280 characters.";

    hours.forEach((h, i) => {
      if (!h.closed) {
        if (!TIME_RE.test(h.open))
          errs[`hours[${i}]`] = `${h.day}: open time must be HH:MM (24h).`;
        else if (!TIME_RE.test(h.close))
          errs[`hours[${i}]`] = `${h.day}: close time must be HH:MM (24h).`;
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    await saveContent();
  }

  if (!content) return <div className="loading-spinner" />;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500, color: "var(--fg)" }}>
            Contact Channels
          </h2>
          <p style={{ fontSize: 14, color: "var(--fg-mid)", marginTop: 4 }}>
            Phone, WhatsApp, and opening hours.
          </p>
        </div>
        <button type="button" className="btn btn-ember btn-sm" onClick={handleSave} disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Save"}
        </button>
      </div>

      {/* Phone */}
      <Field label="Phone Number" error={errors.phone}>
        <input
          className="input"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          placeholder="+212 522-123456"
        />
      </Field>

      {/* WhatsApp Number */}
      <Field label="WhatsApp Number" error={errors.whatsapp}>
        <input
          className="input"
          value={whatsapp}
          onChange={(e) => handleWhatsappChange(e.target.value)}
          onBlur={handleWhatsappBlur}
          placeholder="+212600000000 (auto-adds +212 if starts with 0)"
        />
        <p style={{ fontSize: 11, color: "var(--fg-faint)", marginTop: 4 }}>
          Numbers starting with 0 are automatically prefixed with +212 (Morocco).
        </p>
      </Field>

      {/* WhatsApp Greeting */}
      <Field label="WhatsApp Greeting Message" error={errors.greeting} charCount={`${greeting.length}/280`}>
        <textarea
          className="input"
          value={greeting}
          onChange={(e) => handleGreetingChange(e.target.value)}
          maxLength={280}
          rows={2}
          style={{ resize: "vertical", minHeight: 56 }}
          placeholder="Hello! I'd like to place an order."
        />
      </Field>

      {/* WhatsApp CTA Label */}
      <Field label="WhatsApp Button Label">
        <input
          className="input"
          value={ctaLabel}
          onChange={(e) => handleCtaLabelChange(e.target.value)}
          placeholder='Default: "Order on WhatsApp"'
        />
      </Field>

      <Divider />

      {/* Opening Hours */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-faint)" }}>
          Opening Hours
        </label>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {hours.map((h, i) => (
          <HourRow
            key={h.day}
            hour={h}
            error={errors[`hours[${i}]`]}
            onChange={(field, value) => handleHourChange(i, field, value)}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Hour Row ────────────────────────────────────────────────────────────── */

function HourRow({ hour, error, onChange }) {
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "110px 1fr 1fr auto",
          gap: 10,
          alignItems: "center",
          padding: "10px 14px",
          background: "var(--surface-2, #1C1C22)",
          border: "1px solid var(--rule)",
          borderRadius: 10,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)" }}>
          {hour.day}
        </span>

        {hour.closed ? (
          <span style={{ gridColumn: "2 / 4", fontSize: 13, color: "var(--fg-faint)", fontStyle: "italic" }}>
            Closed
          </span>
        ) : (
          <>
            <input
              className="input"
              type="time"
              value={hour.open}
              onChange={(e) => onChange("open", e.target.value)}
              style={{ padding: "6px 10px", fontSize: 13 }}
            />
            <input
              className="input"
              type="time"
              value={hour.close}
              onChange={(e) => onChange("close", e.target.value)}
              style={{ padding: "6px 10px", fontSize: 13 }}
            />
          </>
        )}

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: "var(--fg-faint)",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <input
            type="checkbox"
            checked={hour.closed}
            onChange={(e) => onChange("closed", e.target.checked)}
            style={{ accentColor: "var(--ember)" }}
          />
          Closed
        </label>
      </div>
      {error && <div role="alert" style={{ marginTop: 4, marginLeft: 14, fontSize: 12, color: "var(--ember)", fontWeight: 500 }}>{error}</div>}
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
      {error && <div role="alert" style={{ marginTop: 4, fontSize: 12, color: "var(--ember)", fontWeight: 500 }}>{error}</div>}
    </div>
  );
}

function Divider() {
  return <div style={{ borderTop: "1px solid var(--rule)", margin: "28px 0" }} />;
}
