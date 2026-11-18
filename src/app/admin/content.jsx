import React from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useContent } from "../../lib/content-context.js";

import BrandingEditor from "./editors/BrandingEditor";
import LandingEditor  from "./editors/LandingEditor";
import LocationEditor from "./editors/LocationEditor";
import ContactEditor  from "./editors/ContactEditor";
import CategoryEditor from "./editors/CategoryEditor";
import ItemEditor     from "./editors/ItemEditor";

/* ───────────────────────────────────────────────────────────────
   CMS shell — mounted under /admin/*
   Sidebar with: Branding, Landing, Menu Categories, Menu Items,
   Location, Contact. Status banner shows save/offline state.
   ─────────────────────────────────────────────────────────────── */

const SECTIONS = [
  { slug: "branding",        label: "Branding",        hint: "Name, tagline, logo" },
  { slug: "landing",         label: "Home page",       hint: "Hero text, photos, sections" },
  { slug: "menu-categories", label: "Menu categories", hint: "Starters, mains, drinks…" },
  { slug: "menu-items",      label: "Dishes",          hint: "Name, photo, price, description" },
  { slug: "location",        label: "Location & map",  hint: "Address & Google Maps" },
  { slug: "contact",         label: "Contact",         hint: "Phone, WhatsApp, hours" },
];

const STATUS_LABELS = {
  loaded:  "All saved",
  saved:   "All saved",
  saving:  "Saving…",
  unsaved: "Unsaved changes",
  offline: "Offline — saved locally only",
};

const STATUS_COLORS = {
  loaded:  "var(--sage)",
  saved:   "var(--sage)",
  saving:  "var(--marigold)",
  unsaved: "var(--marigold)",
  offline: "var(--ember)",
};

export default function ContentCMS() {
  const { status } = useContent();

  return (
    <div className="cms">
      {/* Header strip */}
      <header className="cms-header">
        <div>
          <span className="eyebrow">Manager</span>
          <h1 className="cms-title">Edit your website</h1>
          <p className="cms-sub">
            Change any text, photo, dish or detail. Hit <strong>Save</strong> in each section to publish.
          </p>
        </div>
        <div className="cms-status" data-status={status || "loaded"}>
          <span
            className="cms-status-dot"
            style={{
              background: STATUS_COLORS[status] || STATUS_COLORS.loaded,
              boxShadow: `0 0 8px ${STATUS_COLORS[status] || STATUS_COLORS.loaded}`,
            }}
          />
          <span>{STATUS_LABELS[status] || "All saved"}</span>
        </div>
      </header>

      <div className="cms-grid">
        {/* Sidebar */}
        <nav className="cms-sidebar" aria-label="CMS sections">
          {SECTIONS.map((s) => (
            <NavLink
              key={s.slug}
              to={`/admin/${s.slug}`}
              className={({ isActive }) =>
                `cms-nav-link${isActive ? " cms-nav-link--active" : ""}`
              }
            >
              <span className="cms-nav-link-label">{s.label}</span>
              <span className="cms-nav-link-hint">{s.hint}</span>
            </NavLink>
          ))}
        </nav>

        {/* Editor pane */}
        <section className="cms-pane">
          <Routes>
            <Route index                        element={<Navigate to="branding" replace />} />
            <Route path="branding"              element={<BrandingEditor />} />
            <Route path="landing"               element={<LandingEditor />} />
            <Route path="menu-categories"       element={<CategoryEditor />} />
            <Route path="menu-items"            element={<ItemEditor />} />
            <Route path="location"              element={<LocationEditor />} />
            <Route path="contact"               element={<ContactEditor />} />
            {/* Backward-compat for old /admin/content/* deep links */}
            <Route path="content"               element={<Navigate to="/admin/branding" replace />} />
            <Route path="content/:section"      element={<RedirectFromOldPath />} />
            <Route path="*"                     element={<Navigate to="branding" replace />} />
          </Routes>
        </section>
      </div>
    </div>
  );
}

/** Redirect /admin/content/<x> → /admin/<x> for any old links */
function RedirectFromOldPath() {
  const segment = window.location.pathname.split("/").pop();
  return <Navigate to={`/admin/${segment}`} replace />;
}
