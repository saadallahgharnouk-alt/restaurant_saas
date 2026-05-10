import React from "react";

/* ───────────────────────────────────────────────────────────────
   WhatsApp CTA (Req 2)
   Renders a WhatsApp link button.
   - Strips non-digits from number for the URL
   - Hides when number has <8 digits
   - Appends table number to greeting on scan menu
   ─────────────────────────────────────────────────────────────── */

export default function WhatsAppCTA({ contact, table, className = "" }) {
  if (!contact) return null;

  const rawNumber = contact.whatsappNumber || "";
  const digits = rawNumber.replace(/\D/g, "");

  // Hide if fewer than 8 digits
  if (digits.length < 8) return null;

  const label = contact.whatsappCtaLabel || "Order on WhatsApp";
  let greeting = contact.whatsappGreeting || "";

  // Append table number if present
  if (table) {
    greeting = greeting ? `${greeting}\n\nTable: ${table}` : `Table: ${table}`;
  }

  const href = `https://wa.me/${digits}?text=${encodeURIComponent(greeting)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-whatsapp ${className}`.trim()}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 20px",
        borderRadius: 99,
        background: "#25D366",
        color: "#fff",
        fontWeight: 600,
        fontSize: 14,
        textDecoration: "none",
        border: "none",
        boxShadow: "0 4px 16px rgba(37, 211, 102, 0.3)",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(37, 211, 102, 0.4)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(37, 211, 102, 0.3)"; }}
    >
      {/* WhatsApp icon */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.553 4.11 1.519 5.838L0 24l6.335-1.652A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-1.862 0-3.59-.506-5.08-1.39l-.364-.217-3.776.99.998-3.648-.237-.377A9.783 9.783 0 012.182 12c0-5.423 4.395-9.818 9.818-9.818S21.818 6.577 21.818 12s-4.395 9.818-9.818 9.818z"/>
      </svg>
      {label}
    </a>
  );
}
