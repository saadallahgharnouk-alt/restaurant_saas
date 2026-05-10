import React, { useState, useEffect } from "react";
import { useContent } from "../../../lib/content-store";

/* ───────────────────────────────────────────────────────────────
   Menu Category Editor (Req 11)
   CRUD, reorder, delete-with-confirmation when items reference category.
   ─────────────────────────────────────────────────────────────── */

function generateId() {
  return `cat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CategoryEditor() {
  const { content, updateContent, saveContent, status } = useContent();
  const categories = content?.menu?.categories;
  const items = content?.menu?.items;

  const [local, setLocal] = useState([]);
  const [errors, setErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null); // { index, itemCount }

  // Sync from store
  useEffect(() => {
    if (categories) {
      setLocal(structuredClone(categories));
    }
  }, [categories]);

  function push(updated) {
    // Reassign order values to match display position
    const ordered = updated.map((c, i) => ({ ...c, order: i }));
    setLocal(ordered);
    updateContent("menu.categories", ordered);
  }

  function handleNameChange(index, value) {
    const updated = [...local];
    updated[index] = { ...updated[index], name: value, slug: slugify(value) };
    push(updated);
    setErrors((prev) => { const n = { ...prev }; delete n[index]; return n; });
  }

  function handleAdd() {
    const newCat = { id: generateId(), name: "", slug: "", order: local.length };
    push([...local, newCat]);
  }

  function handleMoveUp(index) {
    if (index === 0) return;
    const updated = [...local];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    push(updated);
  }

  function handleMoveDown(index) {
    if (index >= local.length - 1) return;
    const updated = [...local];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    push(updated);
  }

  function handleRequestDelete(index) {
    const cat = local[index];
    const affectedCount = (items || []).filter((it) => it.categoryId === cat.id).length;
    if (affectedCount > 0) {
      setConfirmDelete({ index, itemCount: affectedCount, name: cat.name });
    } else {
      doDelete(index);
    }
  }

  function doDelete(index) {
    const cat = local[index];
    const updated = local.filter((_, i) => i !== index);
    push(updated);

    // Nullify categoryId on affected items
    if (items) {
      const updatedItems = items.map((it) =>
        it.categoryId === cat.id ? { ...it, categoryId: null } : it
      );
      updateContent("menu.items", updatedItems);
    }
    setConfirmDelete(null);
  }

  function validate() {
    const errs = {};
    local.forEach((c, i) => {
      if (!c.name || c.name.trim().length < 1)
        errs[i] = "Name must be at least 1 character.";
      else if (c.name.length > 40)
        errs[i] = "Name must be at most 40 characters.";
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
            Menu Categories
          </h2>
          <p style={{ fontSize: 14, color: "var(--fg-mid)", marginTop: 4 }}>
            Organize your dishes into groups. Drag to reorder.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleAdd}>
            + Add Category
          </button>
          <button type="button" className="btn btn-ember btn-sm" onClick={handleSave} disabled={status === "saving"}>
            {status === "saving" ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Category list */}
      {local.length === 0 && (
        <div style={{ padding: 40, textAlign: "center", color: "var(--fg-faint)" }}>
          No categories yet. Click "+ Add Category" to create one.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {local.map((cat, i) => (
          <div
            key={cat.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 12,
              alignItems: "center",
              padding: "12px 16px",
              background: "var(--surface-2, #1C1C22)",
              border: `1px solid ${errors[i] ? "var(--ember)" : "var(--rule)"}`,
              borderRadius: 12,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <input
                className="input"
                value={cat.name}
                onChange={(e) => handleNameChange(i, e.target.value)}
                placeholder="Category name (e.g. Starters)"
                maxLength={40}
                style={{ padding: "8px 12px", fontSize: 14 }}
              />
              {errors[i] && (
                <span style={{ fontSize: 11, color: "var(--ember)", fontWeight: 500 }}>
                  {errors[i]}
                </span>
              )}
              <span style={{ fontSize: 11, color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>
                ID: {cat.id} · slug: {cat.slug || "—"} · order: {cat.order}
              </span>
            </div>

            <div style={{ display: "flex", gap: 4 }}>
              <MiniBtn onClick={() => handleMoveUp(i)} title="Move up" disabled={i === 0}>↑</MiniBtn>
              <MiniBtn onClick={() => handleMoveDown(i)} title="Move down" disabled={i >= local.length - 1}>↓</MiniBtn>
              <MiniBtn onClick={() => handleRequestDelete(i)} title="Delete" danger>×</MiniBtn>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      {confirmDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            style={{
              background: "var(--surface, #15151A)",
              border: "1px solid var(--rule-strong)",
              borderRadius: 18,
              padding: "28px 32px",
              maxWidth: 400,
              width: "100%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}
          >
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 500, color: "var(--fg)", marginBottom: 12 }}>
              Delete "{confirmDelete.name}"?
            </h3>
            <p style={{ fontSize: 14, color: "var(--fg-mid)", lineHeight: 1.5, marginBottom: 20 }}>
              This category has <strong style={{ color: "var(--ember)" }}>{confirmDelete.itemCount}</strong> menu
              {confirmDelete.itemCount === 1 ? " item" : " items"} referencing it. Deleting will set their category to "None".
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-ember btn-sm"
                onClick={() => doDelete(confirmDelete.index)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Mini Button ─────────────────────────────────────────────────────────── */

function MiniBtn({ onClick, title, danger, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        border: "1px solid var(--rule)",
        background: "transparent",
        color: danger ? "var(--ember)" : "var(--fg-faint)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.35 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        lineHeight: 1,
        transition: "background 0.15s, opacity 0.15s",
      }}
    >
      {children}
    </button>
  );
}
