import React from "react";
import MapEmbed from "./MapEmbed";
import WhatsAppCTA from "./WhatsAppCTA";

/* ───────────────────────────────────────────────────────────────
   Contact Section (Req 3)
   Renders map + contact details on the landing page.
   Positioned between testimonials and CTA band.
   ─────────────────────────────────────────────────────────────── */

function digitCount(str) {
  return (str || "").replace(/\D/g, "").length;
}

export default function ContactSection({ location, contact }) {
  // Req 3.9: omit entirely if ALL fields are empty
  const hasPhone = contact?.phoneNumber && contact.phoneNumber.trim();
  const hasWhatsapp = contact?.whatsappNumber && digitCount(contact.whatsappNumber) >= 8;
  const hasAddress = location?.address && location.address.trim();
  const hasHours = contact?.hours && contact.hours.length > 0;

  if (!hasPhone && !hasWhatsapp && !hasAddress && !hasHours) return null;

  return (
    <section
      style={{
        maxWidth: "var(--page-max, 1280px)",
        margin: "0 auto",
        padding: "clamp(56px, 8vw, 100px) var(--page-gutter, 24px)",
      }}
    >
      <div style={{ marginBottom: 36 }}>
        <span className="eyebrow">Find us</span>
        <h2 className="page-title" style={{ marginTop: 10 }}>
          Visit & <em>contact</em>
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          alignItems: "start",
        }}
        className="contact-grid"
      >
        {/* Left: Map */}
        <MapEmbed location={location} />

        {/* Right: Contact details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Phone */}
          {hasPhone && (
            <ContactRow label="Phone">
              {digitCount(contact.phoneNumber) >= 8 ? (
                <a
                  href={`tel:${contact.phoneNumber.replace(/[^\d+]/g, "")}`}
                  style={{ color: "var(--fg, #F4F1EA)", textDecoration: "none", fontSize: 16, fontWeight: 500 }}
                >
                  {contact.phoneNumber}
                </a>
              ) : (
                <span style={{ fontSize: 16, color: "var(--fg)" }}>{contact.phoneNumber}</span>
              )}
            </ContactRow>
          )}

          {/* WhatsApp */}
          {hasWhatsapp && (
            <ContactRow label="WhatsApp">
              <WhatsAppCTA contact={contact} />
            </ContactRow>
          )}

          {/* Address */}
          {hasAddress && (
            <ContactRow label="Address">
              <span style={{ fontSize: 15, color: "var(--fg-mid, #A5A2A0)", lineHeight: 1.5 }}>
                {location.address}
              </span>
            </ContactRow>
          )}

          {/* Hours */}
          {hasHours && (
            <ContactRow label="Opening Hours">
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {contact.hours.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                      color: h.closed ? "var(--fg-faint, #6B686A)" : "var(--fg-mid, #A5A2A0)",
                      padding: "4px 0",
                    }}
                  >
                    <span style={{ fontWeight: 500, color: "var(--fg, #F4F1EA)" }}>{h.day}</span>
                    <span>
                      {h.closed ? (
                        <em style={{ fontStyle: "italic", color: "var(--fg-faint)" }}>Closed</em>
                      ) : (
                        `${h.open} – ${h.close}`
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </ContactRow>
          )}
        </div>
      </div>

      {/* Responsive: stack vertically on narrow viewports */}
      <style>{`
        @media (max-width: 767px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function ContactRow({ label, children }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--fg-faint, #6B686A)",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
