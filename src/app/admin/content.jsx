import React from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useContent } from "../../lib/content-store";

// Editor panels (will be built out in tasks #4–#9)
import BrandingEditor from "./editors/BrandingEditor";
import LandingEditor from "./editors/LandingEditor";
import LocationEditor from "./editors/LocationEditor";
import ContactEditor from "./editors/ContactEditor";
import CategoryEditor from "./editors/CategoryEditor";
import ItemEditor from "./editors/ItemEditor";

/* ───────────────────────────────────────────────────────────────
   CMS Shell — /admin/content
   Left sidebar section nav + status banner + main editor area.
   ─────────────────────────────────────────────────────────────── */

const SECTIONS = [
  { slug: "branding", label: "Branding" },
  { slug: "landing", label: "Landing" },
  { slug: "location", label: "Location" },
  { slug: "contact", label: "Contact" },
  { slug: "menu-categories", label: "Menu Categories" },
  { slug: "menu-items", label: "Menu Items" },
];

const STATUS_LABELS = {
  loaded: "Saved",
  saved: "Saved",
  saving: "Saving…",
  unsaved: "Unsaved changes",
  offline: "Offline — using local backup",
};

const STATUS_COLORS = {
  loaded: "var(--sage, #4FD9B2)",
  saved: "var(--sage, #4FD9B2)",
  saving: "var(--marigold, #FFB84D)",
  unsaved: "var(--marigold, #FFB84D)",
  offline: "var(--ember, #FF6B1F)",
};

export default function ContentCMS() {
  const { status } = useContent();

  return (
    <div className="page" style={{ padding: "32px var(--page-gutter)" }}>
      {/* Status banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 28,
          padding: "10px 16px",
          background: "var(--surface, #15151A)",
          border: "1px solid var(--rule, rgba(255,255,255,0.07))",
          borderRadius: 12,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: STATUS_COLORS[status] || STATUS_COLORS.loaded,
            boxShadow: `0 0 8px ${STATUS_COLORS[status] || STATUS_COLORS.loaded}`,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.08em",
            color: "var(--fg-mid, #A5A2A0)",
          }}
        >
          {STATUS_LABELS[status] || "Saved"}
        </span>
      </div>

      {/* Main layout: sidebar + editor */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: 32,
          alignItems: "start",
        }}
      >
        {/* Left-hand section nav */}
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            position: "sticky",
            top: "calc(var(--nav-h, 72px) + 24px)",
          }}
        >
          {SECTIONS.map((s) => (
            <NavLink
              key={s.slug}
              to={`/admin/content/${s.slug}`}
              className={({ isActive }) =>
                `cms-nav-link${isActive ? " cms-nav-link--active" : ""}`
              }
              style={({ isActive }) => ({
                display: "block",
                padding: "10px 14px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                color: isActive
                  ? "var(--fg, #F4F1EA)"
                  : "var(--fg-mid, #A5A2A0)",
                background: isActive
                  ? "var(--surface-2, #1C1C22)"
                  : "transparent",
                border: isActive
                  ? "1px solid var(--rule-strong, rgba(255,255,255,0.15))"
                  : "1px solid transparent",
                transition: "all 0.2s ease",
                textDecoration: "none",
              })}
            >
              {s.label}
            </NavLink>
          ))}
        </nav>

        {/* Editor area */}
        <div
          style={{
            minHeight: 400,
            background: "var(--surface, #15151A)",
            border: "1px solid var(--rule, rgba(255,255,255,0.07))",
            borderRadius: 16,
            padding: 28,
          }}
        >
          <Routes>
            <Route index element={<Navigate to="branding" replace />} />
            <Route path="branding" element={<BrandingEditor />} />
            <Route path="landing" element={<LandingEditor />} />
            <Route path="location" element={<LocationEditor />} />
            <Route path="contact" element={<ContactEditor />} />
            <Route path="menu-categories" element={<CategoryEditor />} />
            <Route path="menu-items" element={<ItemEditor />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
