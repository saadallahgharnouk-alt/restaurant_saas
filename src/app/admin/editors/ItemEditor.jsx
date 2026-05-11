import React, { useState, useEffect } from "react";
import { useContent } from "../../../lib/content-store";
import MediaUpload from "../../../components/MediaUpload";

/* ───────────────────────────────────────────────────────────────
   Menu Item Editor (Req 12)
   Full CRUD, priceCents, ingredients list, categoryId select,
   active toggle with "Hidden" badge, currency select.
   ─────────────────────────────────────────────────────────────── */

const CURRENCIES = ["MAD", "EUR", "USD"];

function generateId() {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function ItemEditor() {
  const { content, updateContent, saveContent, status } = useContent();
  const items = content?.menu?.items;
  const categories = content?.menu?.categories;

  const [local, setLocal] = useState([]);
  const [errors, setErrors] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    if (items) setLocal(structuredClone(items));
  }, [items]);

  function push(updated) {
    setLocal(updated);
    updateContent("menu.items", updated);
  }

  function handleAdd() {
    const newItem = {
      id: generateId(),
      categoryId: categories?.[0]?.id || null,
      name: "",
      description: "",
      priceCents: 0,
      currency: "MAD",
      ingredients: [],
      photoUrl: "",
      active: true,
    };
    const updated = [...local, newItem];
    push(updated);
    setEditingIndex(updated.length - 1);
  }

  function handleUpdate(index, field, value) {
    const updated = [...local];
    updated[index] = { ...updated[index], [field]: value };
    push(updated);
    setErrors((prev) => { const n = { ...prev }; delete n[`${index}.${field}`]; return n; });
  }

  function handleDelete(index) {
    push(local.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
    else if (editingIndex !== null && editingIndex > index) setEditingIndex(editingIndex - 1);
  }

  function handleToggleActive(index) {
    const updated = [...local];
    updated[index] = { ...updated[index], active: !updated[index].active };
    push(updated);
  }

  function validate() {
    const errs = {};
    local.forEach((item, i) => {
      if (!item.name || item.name.trim().length < 1)
        errs[`${i}.name`] = "Name is required (1-80 chars).";
      else if (item.name.length > 80)
        errs[`${i}.name`] = "Name must be at most 80 characters.";

      if (item.description && item.description.length > 400)
        errs[`${i}.description`] = "Description must be at most 400 characters.";

      if (!Number.isInteger(item.priceCents) || item.priceCents < 0 || item.priceCents > 10000000)
        errs[`${i}.priceCents`] = "Price must be 0-10,000,000 centimes.";

      if (!CURRENCIES.includes(item.currency))
        errs[`${i}.currency`] = "Currency must be MAD, EUR, or USD.";

      if (item.categoryId !== null && categories && !categories.find((c) => c.id === item.categoryId))
        errs[`${i}.categoryId`] = "Invalid category reference.";

      (item.ingredients || []).forEach((ing, j) => {
        if (!ing || ing.length < 1 || ing.length > 40)
          errs[`${i}.ingredients[${j}]`] = "Each ingredient must be 1-40 chars.";
      });
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
            Menu Items
          </h2>
          <p style={{ fontSize: 14, color: "var(--fg-mid)", marginTop: 4 }}>
            {local.length} item{local.length !== 1 ? "s" : ""} · Click to edit
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleAdd}>+ Add Item</button>
          <button type="button" className="btn btn-ember btn-sm" onClick={handleSave} disabled={status === "saving"}>
            {status === "saving" ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Item list */}
      {local.length === 0 && (
        <div style={{ padding: 40, textAlign: "center", color: "var(--fg-faint)" }}>
          No items yet. Click "+ Add Item" to create one.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {local.map((item, i) => (
          <div key={item.id}>
            {/* Collapsed row */}
            <div
              onClick={() => setEditingIndex(editingIndex === i ? null : i)}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto auto",
                gap: 12,
                alignItems: "center",
                padding: "12px 16px",
                background: editingIndex === i ? "var(--surface-2)" : "var(--surface)",
                border: `1px solid ${errors[`${i}.name`] ? "var(--ember)" : "var(--rule)"}`,
                borderRadius: editingIndex === i ? "12px 12px 0 0" : 12,
                cursor: "pointer",
                transition: "background 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                {!item.active && (
                  <span style={{
                    padding: "2px 8px",
                    borderRadius: 99,
                    background: "rgba(255,107,31,0.12)",
                    border: "1px solid rgba(255,107,31,0.3)",
                    color: "var(--ember)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    flexShrink: 0,
                  }}>
                    Hidden
                  </span>
                )}
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.name || <em style={{ color: "var(--fg-faint)" }}>Untitled</em>}
                </span>
              </div>

              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-mid)" }}>
                {formatPrice(item.priceCents, item.currency)}
              </span>

              <span style={{ fontSize: 11, color: "var(--fg-faint)" }}>
                {getCategoryName(item.categoryId, categories)}
              </span>

              <MiniBtn onClick={(e) => { e.stopPropagation(); handleDelete(i); }} title="Delete" danger>×</MiniBtn>
            </div>

            {/* Expanded editor */}
            {editingIndex === i && (
              <ItemForm
                item={item}
                index={i}
                categories={categories || []}
                errors={errors}
                onChange={(field, value) => handleUpdate(i, field, value)}
                onToggleActive={() => handleToggleActive(i)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Item Form (expanded) ────────────────────────────────────────────────── */

function ItemForm({ item, index, categories, errors, onChange, onToggleActive }) {
  return (
    <div
      style={{
        padding: "20px 16px",
        background: "var(--surface-2)",
        border: "1px solid var(--rule)",
        borderTop: "none",
        borderRadius: "0 0 12px 12px",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Field label="Name" error={errors[`${index}.name`]}>
          <input className="input" value={item.name} onChange={(e) => onChange("name", e.target.value)} maxLength={80} placeholder="Dish name" />
        </Field>
        <Field label="Category" error={errors[`${index}.categoryId`]}>
          <select
            className="input"
            value={item.categoryId || ""}
            onChange={(e) => onChange("categoryId", e.target.value || null)}
            style={{ cursor: "pointer" }}
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Description" error={errors[`${index}.description`]}>
        <textarea
          className="input"
          value={item.description}
          onChange={(e) => onChange("description", e.target.value)}
          maxLength={400}
          rows={2}
          style={{ resize: "vertical", minHeight: 50 }}
          placeholder="Short description…"
        />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        <Field label="Price (centimes)" error={errors[`${index}.priceCents`]}>
          <input
            className="input"
            type="number"
            min={0}
            max={10000000}
            value={item.priceCents}
            onChange={(e) => onChange("priceCents", parseInt(e.target.value, 10) || 0)}
          />
        </Field>
        <Field label="Currency" error={errors[`${index}.currency`]}>
          <select className="input" value={item.currency} onChange={(e) => onChange("currency", e.target.value)} style={{ cursor: "pointer" }}>
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Display Price">
          <div style={{ padding: "8px 12px", background: "var(--surface)", borderRadius: 10, border: "1px solid var(--rule)", fontSize: 16, fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--fg)" }}>
            {formatPrice(item.priceCents, item.currency)}
          </div>
        </Field>
      </div>

      <Field label="Photo">
        <input className="input" value={item.photoUrl} onChange={(e) => onChange("photoUrl", e.target.value)} placeholder="https://... or upload below" />
        <MediaUpload
          value={item.photoUrl}
          onChange={(url) => onChange("photoUrl", url)}
          label="Upload dish photo"
        />
      </Field>

      {/* Ingredients */}
      <Field label="Ingredients">
        <IngredientsEditor
          ingredients={item.ingredients || []}
          onChange={(val) => onChange("ingredients", val)}
          errors={errors}
          itemIndex={index}
        />
      </Field>

      {/* Active toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, paddingTop: 12, borderTop: "1px solid var(--rule)" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "var(--fg-mid)" }}>
          <input
            type="checkbox"
            checked={item.active}
            onChange={onToggleActive}
            style={{ accentColor: "var(--sage, #4FD9B2)" }}
          />
          Visible on menu
        </label>
        {!item.active && (
          <span style={{ fontSize: 11, color: "var(--ember)", fontWeight: 500 }}>
            This item is hidden from customers.
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Ingredients Editor ──────────────────────────────────────────────────── */

function IngredientsEditor({ ingredients, onChange, errors, itemIndex }) {
  const [draft, setDraft] = useState("");

  function add() {
    const val = draft.trim();
    if (!val || val.length > 40) return;
    onChange([...ingredients, val]);
    setDraft("");
  }

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
        {ingredients.map((ing, j) => (
          <span
            key={j}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              background: "var(--surface)",
              border: `1px solid ${errors[`${itemIndex}.ingredients[${j}]`] ? "var(--ember)" : "var(--rule)"}`,
              borderRadius: 99,
              fontSize: 12,
              color: "var(--fg-mid)",
            }}
          >
            {ing}
            <button
              type="button"
              onClick={() => onChange(ingredients.filter((_, idx) => idx !== j))}
              style={{ background: "none", border: "none", color: "var(--fg-faint)", cursor: "pointer", fontSize: 13, padding: 0, lineHeight: 1 }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Add ingredient (1-40 chars)"
          maxLength={40}
          style={{ flex: 1 }}
        />
        <button type="button" className="btn btn-ghost btn-sm" onClick={add}>Add</button>
      </div>
    </div>
  );
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function formatPrice(cents, currency) {
  const value = (cents / 100).toFixed(2);
  const symbols = { MAD: "MAD", EUR: "€", USD: "$" };
  const sym = symbols[currency] || currency;
  if (currency === "MAD") return `${value} ${sym}`;
  return `${sym}${value}`;
}

function getCategoryName(categoryId, categories) {
  if (!categoryId) return "—";
  const cat = (categories || []).find((c) => c.id === categoryId);
  return cat ? cat.name : "—";
}

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-faint)", marginBottom: 4 }}>
        {label}
      </label>
      {children}
      {error && <div role="alert" style={{ marginTop: 4, fontSize: 11, color: "var(--ember)", fontWeight: 500 }}>{error}</div>}
    </div>
  );
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
      }}
    >
      {children}
    </button>
  );
}
