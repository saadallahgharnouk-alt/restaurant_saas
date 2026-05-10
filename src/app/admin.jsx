import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Reveal,
  ImageUploader,
  AnimatedNumber,
  useToast,
} from '../components/primitives';
import { useAuth } from '../store/auth';
import { useContent, useContentActions } from '../store/content';

/* ──────────────────────────────────────────────────────────────
   /admin — the manager panel.
   Three tabs, all writing to the same persisted content store:

     • SITE      — edit every field of the landing page
     • MENU      — add / edit / delete dishes, upload photos
     • ANALYTICS — realistic dashboard derived from demo data
   ────────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'site',      label: 'Site' },
  { id: 'menu',      label: 'Menu' },
  { id: 'analytics', label: 'Analytics' },
];

export default function Admin() {
  const [search, setSearch] = useSearchParams();
  const nav = useNavigate();
  const { user, logout } = useAuth();
  const { resetAll }     = useContentActions();
  const toast = useToast();

  const activeTab = search.get('tab') || 'site';
  const setTab = (id) => setSearch({ tab: id }, { replace: true });

  return (
    <div className="admin-wrap">
      <Reveal
        as="div"
        className="page-header"
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <span className="eyebrow">Manager · {user?.name}</span>
          <h1 className="page-title">
            The <em>kitchen&rsquo;s office</em>.
          </h1>
          <p className="page-sub">
            Every change below updates the public site instantly. Work
            is saved as you type.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-ghost btn-sm">
            View site
          </Link>
          <Link to="/menu" className="btn btn-ghost btn-sm">
            View menu
          </Link>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              if (
                confirm(
                  'Reset ALL site content to defaults? This cannot be undone.'
                )
              ) {
                resetAll();
                toast.success('Reset to defaults');
              }
            }}
          >
            Reset demo
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => {
              logout();
              nav('/');
            }}
          >
            Sign out
          </button>
        </div>
      </Reveal>

      <div className="admin-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={activeTab === t.id}
            onClick={() => setTab(t.id)}
            className={`admin-tab ${activeTab === t.id ? 'active' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'site'      && <SiteEditor />}
      {activeTab === 'menu'      && <MenuEditor />}
      {activeTab === 'analytics' && <AnalyticsPanel />}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Site editor — every section of the landing page
   ══════════════════════════════════════════════════════════════ */

function SiteEditor() {
  const c = useContent();
  const { updatePath, addGalleryImage, removeGalleryImage } =
    useContentActions();
  const toast = useToast();

  return (
    <div>
      {/* ─── Brand ─── */}
      <section className="admin-card">
        <span className="eyebrow">Identity</span>
        <h2 className="admin-section-title">
          The <em>name plate</em>
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 18,
          }}
        >
          <Text
            label="Restaurant name"
            value={c.brand.name}
            onChange={(v) => updatePath('brand.name', v)}
          />
          <Text
            label="Tagline"
            value={c.brand.tagline}
            onChange={(v) => updatePath('brand.tagline', v)}
          />
          <Text
            label="City"
            value={c.brand.location_city}
            onChange={(v) => updatePath('brand.location_city', v)}
          />
          <Text
            label="Country"
            value={c.brand.location_country}
            onChange={(v) => updatePath('brand.location_country', v)}
          />
          <Text
            label="Currency symbol"
            value={c.brand.currency}
            onChange={(v) => updatePath('brand.currency', v)}
          />
          <Text
            label="Phone"
            value={c.brand.phone}
            onChange={(v) => updatePath('brand.phone', v)}
          />
          <Text
            label="Email"
            value={c.brand.email}
            onChange={(v) => updatePath('brand.email', v)}
          />
          <Text
            label="Instagram handle"
            value={c.brand.instagram}
            onChange={(v) => updatePath('brand.instagram', v)}
          />
        </div>
      </section>

      {/* ─── Hero ─── */}
      <section className="admin-card">
        <span className="eyebrow">Hero</span>
        <h2 className="admin-section-title">
          The <em>first impression</em>
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
            alignItems: 'start',
          }}
        >
          <div>
            <Text
              label="Eyebrow"
              value={c.hero.eyebrow}
              onChange={(v) => updatePath('hero.eyebrow', v)}
            />
            <Text
              label="Title — first line"
              value={c.hero.title_before}
              onChange={(v) => updatePath('hero.title_before', v)}
            />
            <Text
              label="Title — italic (gold) word"
              value={c.hero.title_em}
              onChange={(v) => updatePath('hero.title_em', v)}
            />
            <Text
              label="Title — trailing (HTML ok, e.g. &amp;rsquo;)"
              value={c.hero.title_after}
              onChange={(v) => updatePath('hero.title_after', v)}
            />
            <Textarea
              label="Subtitle"
              value={c.hero.subtitle}
              onChange={(v) => updatePath('hero.subtitle', v)}
              rows={3}
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
              }}
            >
              <Text
                label="Primary CTA label"
                value={c.hero.cta_primary?.label}
                onChange={(v) =>
                  updatePath('hero.cta_primary', {
                    ...c.hero.cta_primary,
                    label: v,
                  })
                }
              />
              <Text
                label="Primary CTA link"
                value={c.hero.cta_primary?.href}
                onChange={(v) =>
                  updatePath('hero.cta_primary', {
                    ...c.hero.cta_primary,
                    href: v,
                  })
                }
              />
            </div>
          </div>

          <div>
            <div className="field">
              <label>Hero media</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <button
                  type="button"
                  className={`btn btn-sm ${
                    c.hero.kind === 'video' ? 'btn-ember' : 'btn-ghost'
                  }`}
                  onClick={() => updatePath('hero.kind', 'video')}
                >
                  Video
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${
                    c.hero.kind === 'image' ? 'btn-ember' : 'btn-ghost'
                  }`}
                  onClick={() => updatePath('hero.kind', 'image')}
                >
                  Photo only
                </button>
              </div>
            </div>

            {c.hero.kind === 'video' && (
              <>
                <Text
                  label="Video URL (.mp4 or .webm)"
                  value={c.hero.videoSrc}
                  onChange={(v) => updatePath('hero.videoSrc', v)}
                />
                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--ink-faint)',
                    marginTop: -8,
                    marginBottom: 14,
                  }}
                >
                  Tip: Pexels / Pixabay video URLs work directly. Keep it
                  under 10 MB.
                </p>
              </>
            )}

            <div className="field">
              <label>Poster / fallback image</label>
              <ImageUploader
                value={c.hero.videoPoster || c.hero.image}
                onChange={(url) => {
                  updatePath('hero.videoPoster', url);
                  updatePath('hero.image', url);
                  toast.success('Hero image updated');
                }}
                aspect="16 / 9"
                label="Upload hero photo"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Story ─── */}
      <section className="admin-card">
        <span className="eyebrow">Story</span>
        <h2 className="admin-section-title">
          Your <em>story block</em>
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
            alignItems: 'start',
          }}
        >
          <div>
            <Text
              label="Eyebrow"
              value={c.story.eyebrow}
              onChange={(v) => updatePath('story.eyebrow', v)}
            />
            <Text
              label="Title — first line"
              value={c.story.title_before}
              onChange={(v) => updatePath('story.title_before', v)}
            />
            <Text
              label="Title — italic word"
              value={c.story.title_em}
              onChange={(v) => updatePath('story.title_em', v)}
            />
            <Text
              label="Title — trailing"
              value={c.story.title_after}
              onChange={(v) => updatePath('story.title_after', v)}
            />

            <ParagraphList
              label="Story paragraphs"
              value={c.story.paragraphs}
              onChange={(v) => updatePath('story.paragraphs', v)}
            />

            <Text
              label="Image caption"
              value={c.story.image_caption}
              onChange={(v) => updatePath('story.image_caption', v)}
            />
          </div>

          <div className="field">
            <label>Story photo</label>
            <ImageUploader
              value={c.story.image}
              onChange={(url) => {
                updatePath('story.image', url);
                toast.success('Story photo updated');
              }}
              aspect="4 / 5"
            />
          </div>
        </div>
      </section>

      {/* ─── Signatures intro ─── */}
      <section className="admin-card">
        <span className="eyebrow">Signature dishes intro</span>
        <h2 className="admin-section-title">
          The <em>"on the table tonight"</em> strap
        </h2>
        <p
          style={{
            fontSize: 13,
            color: 'var(--ink-mid)',
            marginBottom: 14,
          }}
        >
          The cards shown in this section are the dishes you mark as{' '}
          <strong>signature</strong> in the Menu tab.
        </p>

        <Text
          label="Eyebrow"
          value={c.signatures.eyebrow}
          onChange={(v) => updatePath('signatures.eyebrow', v)}
        />
        <Text
          label="Title — first line"
          value={c.signatures.title_before}
          onChange={(v) => updatePath('signatures.title_before', v)}
        />
        <Text
          label="Title — italic"
          value={c.signatures.title_em}
          onChange={(v) => updatePath('signatures.title_em', v)}
        />
        <Text
          label="Title — trailing"
          value={c.signatures.title_after}
          onChange={(v) => updatePath('signatures.title_after', v)}
        />
        <Textarea
          label="Subtitle"
          value={c.signatures.subtitle}
          onChange={(v) => updatePath('signatures.subtitle', v)}
          rows={2}
        />
      </section>

      {/* ─── Gallery ─── */}
      <section className="admin-card">
        <span className="eyebrow">Gallery</span>
        <h2 className="admin-section-title">
          Room <em>photos</em>
        </h2>
        <p
          style={{
            fontSize: 13,
            color: 'var(--ink-mid)',
            marginBottom: 14,
          }}
        >
          Up to 12 images. Drag or pick from your computer.
        </p>

        <div style={{ marginBottom: 16, maxWidth: 280 }}>
          <ImageUploader
            value={null}
            onChange={(url) => {
              if (url) {
                addGalleryImage(url);
                toast.success('Added to gallery');
              }
            }}
            aspect="4 / 3"
            label="Add a photo"
          />
        </div>

        <div className="gallery-editor">
          {(c.gallery || []).map((src, i) => (
            <div key={i} className="gallery-editor-item">
              <img src={src} alt="" />
              <button
                type="button"
                onClick={() => removeGalleryImage(i)}
                aria-label="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Location ─── */}
      <section className="admin-card">
        <span className="eyebrow">Location</span>
        <h2 className="admin-section-title">
          Where the <em>door is</em>
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 18,
          }}
        >
          <Text
            label="Address — line 1"
            value={c.location.line1}
            onChange={(v) => updatePath('location.line1', v)}
          />
          <Text
            label="Address — line 2"
            value={c.location.line2}
            onChange={(v) => updatePath('location.line2', v)}
          />
          <Text
            label="Country"
            value={c.location.country}
            onChange={(v) => updatePath('location.country', v)}
          />
          <div />
          <Text
            label="Latitude"
            value={String(c.location.lat)}
            onChange={(v) => updatePath('location.lat', parseFloat(v) || 0)}
          />
          <Text
            label="Longitude"
            value={String(c.location.lng)}
            onChange={(v) => updatePath('location.lng', parseFloat(v) || 0)}
          />
        </div>

        <div style={{ marginTop: 18 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--ink-faint)',
            }}
          >
            Hours
          </span>
          <HoursEditor
            value={c.location.hours || []}
            onChange={(v) => updatePath('location.hours', v)}
          />
        </div>
      </section>

      {/* ─── Reviews ─── */}
      <section className="admin-card">
        <span className="eyebrow">Reviews</span>
        <h2 className="admin-section-title">
          Three <em>guest quotes</em>
        </h2>
        <ReviewsEditor
          value={c.reviews || []}
          onChange={(v) => updatePath('reviews', v)}
        />
      </section>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Menu editor
   ══════════════════════════════════════════════════════════════ */

function MenuEditor() {
  const c = useContent();
  const {
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addCategory,
    updateCategory,
    moveCategory,
    deleteCategory,
  } = useContentActions();
  const toast = useToast();

  const [editing, setEditing]       = useState(null); // item id currently open
  const [newCatName, setNewCatName] = useState('');

  const currency   = c.brand.currency || '$';
  const categories = useMemo(
    () =>
      (c.menu.categories || [])
        .slice()
        .sort((a, b) => (a.order || 0) - (b.order || 0)),
    [c.menu.categories]
  );

  const grouped = useMemo(() => {
    const m = new Map();
    for (const cat of categories) m.set(cat.id, []);
    for (const it of c.menu.items || []) {
      if (!m.has(it.category)) m.set(it.category, []);
      m.get(it.category).push(it);
    }
    return m;
  }, [categories, c.menu.items]);

  const addNew = (categoryId) => {
    const catId = categoryId || categories[0]?.id || 'starters';
    const id = `item-${Date.now()}`;
    addMenuItem({
      id,
      name: 'New dish',
      category: catId,
      price: 0,
    });
    setEditing(id);
    toast.success('New dish added — fill in the details');
  };

  const submitNewCategory = (e) => {
    e?.preventDefault?.();
    const name = newCatName.trim();
    if (!name) return;
    addCategory(name);
    setNewCatName('');
    toast.success(`Category "${name}" added`);
  };

  const handleDeleteCategory = (cat) => {
    if (categories.length <= 1) {
      toast.error('Keep at least one category.');
      return;
    }
    const count = (grouped.get(cat.id) || []).length;
    const fallback = categories.find((c) => c.id !== cat.id);
    const msg =
      count === 0
        ? `Delete the "${cat.name}" category?`
        : `"${cat.name}" has ${count} dish${count === 1 ? '' : 'es'}. ` +
          `They'll move to "${fallback.name}". Continue?`;
    if (!confirm(msg)) return;
    deleteCategory(cat.id, fallback.id);
    toast.success(`Category "${cat.name}" removed`);
  };

  return (
    <div>
      {/* ─── Category manager ────────────────────────────── */}
      <section className="admin-card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 10,
          }}
        >
          <div>
            <span className="eyebrow">Categories</span>
            <h2 className="admin-section-title">
              Sections of the <em>card</em>
            </h2>
            <p
              style={{
                color: 'var(--ink-mid)',
                fontSize: 14,
                maxWidth: '60ch',
                lineHeight: 1.55,
              }}
            >
              Reorder, rename, add new (Salads, Cocktails, Wine, …), or remove.
              Removing a category moves its dishes to the first remaining one.
            </p>
          </div>

          <form
            onSubmit={submitNewCategory}
            style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
          >
            <input
              className="input"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="New category name…"
              style={{ minWidth: 220 }}
            />
            <button type="submit" className="btn btn-ember btn-arrow btn-sm">
              Add category
            </button>
          </form>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 10,
            marginTop: 18,
          }}
        >
          {categories.map((cat, i) => {
            const count = (grouped.get(cat.id) || []).length;
            return (
              <div
                key={cat.id}
                style={{
                  background: 'var(--paper-soft)',
                  border: '1px solid var(--rule)',
                  borderRadius: 14,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    style={{ padding: '2px 8px', fontSize: 11 }}
                    disabled={i === 0}
                    onClick={() => moveCategory(cat.id, -1)}
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    style={{ padding: '2px 8px', fontSize: 11 }}
                    disabled={i === categories.length - 1}
                    onClick={() => moveCategory(cat.id, +1)}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <input
                    value={cat.name}
                    onChange={(e) =>
                      updateCategory(cat.id, { name: e.target.value })
                    }
                    className="input"
                    style={{
                      background: 'var(--paper-mist)',
                      fontFamily: 'var(--font-display)',
                      fontSize: 16,
                      fontWeight: 500,
                      letterSpacing: '-0.01em',
                      padding: '8px 12px',
                    }}
                    aria-label={`Category ${i + 1} name`}
                  />
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--ink-faint)',
                      letterSpacing: '0.08em',
                      marginTop: 4,
                      textTransform: 'uppercase',
                    }}
                  >
                    {count} dish{count === 1 ? '' : 'es'} &middot; slug: {cat.id}
                  </span>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteCategory(cat)}
                  aria-label={`Delete ${cat.name}`}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Dish editor ─────────────────────────────────── */}
      <section className="admin-card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 10,
          }}
        >
          <div>
            <span className="eyebrow">Menu</span>
            <h2 className="admin-section-title">
              Edit <em>what&rsquo;s cooking</em>
            </h2>
            <p style={{ color: 'var(--ink-mid)', fontSize: 14 }}>
              {(c.menu.items || []).length} dishes &middot;{' '}
              {(c.menu.items || []).filter((i) => i.available).length} available
            </p>
          </div>
          <button
            type="button"
            onClick={() => addNew()}
            className="btn btn-ember btn-arrow"
          >
            Add a dish
          </button>
        </div>

        {categories.map((cat) => {
          const list = grouped.get(cat.id) || [];
          return (
            <div key={cat.id} style={{ marginTop: 24 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: 12,
                  marginBottom: 12,
                  flexWrap: 'wrap',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 20,
                    fontWeight: 500,
                    letterSpacing: '-0.015em',
                    color: 'var(--ink)',
                  }}
                >
                  <em
                    style={{
                      color: 'var(--ember-deep)',
                      fontStyle: 'italic',
                      fontWeight: 380,
                    }}
                  >
                    {cat.name}
                  </em>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--ink-faint)',
                      marginLeft: 10,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {list.length} items
                  </span>
                </h3>

                <button
                  type="button"
                  onClick={() => addNew(cat.id)}
                  className="btn btn-sm btn-ghost btn-arrow"
                >
                  Add to {cat.name}
                </button>
              </div>

              {list.length === 0 && (
                <p
                  style={{
                    color: 'var(--ink-faint)',
                    fontSize: 13,
                    padding: '12px 0',
                    borderTop: '1px dashed var(--rule)',
                    borderBottom: '1px dashed var(--rule)',
                  }}
                >
                  Nothing in {cat.name.toLowerCase()} yet.
                </p>
              )}

              {list.map((item) => (
                <DishEditorRow
                  key={item.id}
                  item={item}
                  currency={currency}
                  categories={categories}
                  isEditing={editing === item.id}
                  onToggleEdit={() =>
                    setEditing(editing === item.id ? null : item.id)
                  }
                  onUpdate={(patch) => updateMenuItem(item.id, patch)}
                  onDelete={() => {
                    if (confirm(`Delete "${item.name}"?`)) {
                      deleteMenuItem(item.id);
                      toast.success('Dish removed');
                    }
                  }}
                />
              ))}
            </div>
          );
        })}
      </section>
    </div>
  );
}

function DishEditorRow({
  item,
  currency,
  categories,
  isEditing,
  onToggleEdit,
  onUpdate,
  onDelete,
}) {
  const toast = useToast();

  if (!isEditing) {
    return (
      <div className="admin-dish" style={{ opacity: item.available ? 1 : 0.55 }}>
        <div className="admin-dish-thumb">
          {item.image ? (
            <img src={item.image} alt="" />
          ) : (
            <div className="empty">NO PHOTO</div>
          )}
        </div>
        <div className="admin-dish-info">
          <strong>
            <span dangerouslySetInnerHTML={{ __html: item.name }} />
            {item.signature && (
              <span
                style={{
                  marginLeft: 8,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  letterSpacing: '0.15em',
                  color: 'var(--paper-mist)',
                  padding: '2px 8px',
                  borderRadius: 99,
                  background: 'var(--teal-deep)',
                  verticalAlign: 'middle',
                }}
              >
                SIGNATURE
              </span>
            )}
          </strong>
          <span className="desc">{item.description || 'No description.'}</span>
          <span className="meta">
            {currency} {item.price} · {item.ingredients?.length || 0} ingredients · {item.extras?.length || 0} extras
            {!item.available && ' · hidden'}
          </span>
        </div>
        <div className="admin-dish-actions">
          <button className="btn btn-sm btn-ghost" onClick={onToggleEdit}>
            Edit
          </button>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => {
              onUpdate({ available: !item.available });
              toast.success(item.available ? 'Hidden from menu' : 'Visible again');
            }}
          >
            {item.available ? 'Hide' : 'Show'}
          </button>
          <button className="btn btn-sm btn-danger" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="admin-card"
      style={{
        borderColor: 'var(--ember)',
        boxShadow: '0 0 0 3px var(--ember-tint)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          gap: 20,
          alignItems: 'start',
        }}
      >
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Photo</label>
          <ImageUploader
            value={item.image}
            onChange={(url) => {
              onUpdate({ image: url });
              toast.success('Photo updated');
            }}
            aspect="1 / 1"
            label="Upload dish photo"
          />
        </div>

        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 140px',
              gap: 12,
            }}
          >
            <Text
              label="Name"
              value={item.name}
              onChange={(v) => onUpdate({ name: v })}
            />
            <Text
              label={`Price (${currency})`}
              value={String(item.price)}
              onChange={(v) => onUpdate({ price: parseFloat(v) || 0 })}
            />
          </div>

          <div className="field">
            <label>Category</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`btn btn-sm ${
                    item.category === cat.id ? 'btn-ember' : 'btn-ghost'
                  }`}
                  onClick={() => onUpdate({ category: cat.id })}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="Description"
            value={item.description}
            onChange={(v) => onUpdate({ description: v })}
            rows={3}
          />

          <div className="field">
            <label>Ingredients</label>
            <ChipList
              value={item.ingredients || []}
              onChange={(v) => onUpdate({ ingredients: v })}
              placeholder="Press Enter to add…"
            />
          </div>

          <div className="field">
            <label>Extras (add-ons)</label>
            <ExtrasEditor
              value={item.extras || []}
              onChange={(v) => onUpdate({ extras: v })}
              currency={currency}
            />
          </div>

          <div
            style={{
              display: 'flex',
              gap: 20,
              flexWrap: 'wrap',
              alignItems: 'center',
              margin: '10px 0 18px',
            }}
          >
            <Toggle
              label="Available on the menu"
              value={item.available}
              onChange={(v) => onUpdate({ available: v })}
            />
            <Toggle
              label="Mark as signature (shown on landing)"
              value={!!item.signature}
              onChange={(v) => onUpdate({ signature: v })}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn btn-danger btn-sm" onClick={onDelete}>
              Delete
            </button>
            <button className="btn btn-ember btn-sm" onClick={onToggleEdit}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Analytics (realistic-looking mock, derived from the real menu)
   ══════════════════════════════════════════════════════════════ */

function AnalyticsPanel() {
  const c = useContent();
  const currency = c.brand.currency || '$';

  // Derive "numbers" deterministically from the menu so they change as
  // the manager edits prices. Feels alive, doesn't pretend to be real.
  const weekly = useMemo(() => {
    const base = (c.menu.items || []).reduce(
      (s, i) => s + (i.available ? i.price : 0),
      0
    );
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((d, i) => ({
      day: d,
      revenue: Math.round(base * (0.9 + (i * 7 + 13) % 100 / 100)),
    }));
  }, [c.menu]);

  const topItems = useMemo(() => {
    return (c.menu.items || [])
      .filter((i) => i.available)
      .slice()
      .sort((a, b) => (b.signature ? 1 : 0) - (a.signature ? 1 : 0) || b.price - a.price)
      .slice(0, 5)
      .map((item, i) => ({
        ...item,
        orders: 80 + (i * 37 + item.price * 3) % 200,
        revenue: Math.round((80 + (i * 37 + item.price * 3) % 200) * item.price),
      }));
  }, [c.menu]);

  const totalRevenue = weekly.reduce((s, w) => s + w.revenue, 0);
  const totalOrders  = topItems.reduce((s, i) => s + i.orders, 0);
  const avgTicket    = totalOrders ? totalRevenue / totalOrders : 0;
  const maxRev       = Math.max(...weekly.map((w) => w.revenue));
  const maxItemRev   = Math.max(1, ...topItems.map((i) => i.revenue));

  return (
    <div>
      <section className="admin-card">
        <span className="eyebrow">Last 7 days (demo)</span>
        <h2 className="admin-section-title">
          The <em>numbers</em>
        </h2>

        <div
          className="grid-4"
          style={{ marginTop: 6, marginBottom: 24 }}
        >
          <Kpi label="Revenue" value={totalRevenue} prefix={`${currency} `} delta="+12%" up />
          <Kpi label="Orders"  value={totalOrders} delta="+8%" up />
          <Kpi
            label="Avg ticket"
            value={Number(avgTicket.toFixed(1))}
            prefix={`${currency} `}
            decimals={1}
            delta="+3%"
            up
          />
          <Kpi label="Tables scanned" value={62} suffix="%" delta="+6%" up />
        </div>

        <div
          className="grid-2"
          style={{ gridTemplateColumns: '1.6fr 1fr', gap: 16 }}
        >
          {/* Weekly bars */}
          <div
            style={{
              padding: 24,
              background: 'var(--paper-soft)',
              borderRadius: 'var(--r-lg)',
              border: '1px solid var(--rule)',
            }}
          >
            <span className="eyebrow">Weekly revenue</span>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 10,
                height: 220,
                marginTop: 20,
                paddingBottom: 6,
              }}
            >
              {weekly.map((d, i) => {
                const h = (d.revenue / maxRev) * 100;
                const peak = d.revenue === maxRev;
                return (
                  <div
                    key={d.day}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      height: '100%',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--ink-faint)',
                        opacity: peak ? 1 : 0.7,
                      }}
                    >
                      {currency} {Math.round(d.revenue)}
                    </span>
                    <div
                      style={{
                        width: '100%',
                        borderRadius: '10px 10px 0 0',
                        background: peak
                          ? 'linear-gradient(180deg, #D25A35 0%, #942A18 100%)'
                          : 'linear-gradient(180deg, rgba(210,90,53,0.55), rgba(210,90,53,0.22))',
                        height: `${h}%`,
                        transition: `height 1s ${i * 0.07}s var(--ease-out)`,
                        boxShadow: peak ? 'var(--glow-ember)' : 'none',
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--ink-faint)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top items */}
          <div
            style={{
              padding: 24,
              background: 'var(--paper-soft)',
              borderRadius: 'var(--r-lg)',
              border: '1px solid var(--rule)',
            }}
          >
            <span className="eyebrow">Top dishes</span>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                marginTop: 16,
              }}
            >
              {topItems.map((i, idx) => (
                <div key={i.id}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 500,
                        fontSize: 14,
                        color: 'var(--ink)',
                      }}
                      dangerouslySetInnerHTML={{ __html: i.name }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--ember-deep)',
                      }}
                    >
                      {currency} {i.revenue}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 4,
                      background: 'var(--paper)',
                      borderRadius: 99,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${(i.revenue / maxItemRev) * 100}%`,
                        background:
                          'linear-gradient(90deg, #D25A35, #942A18)',
                        transition: `width 1s ${idx * 0.08}s var(--ease-out)`,
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--ink-faint)',
                      marginTop: 4,
                    }}
                  >
                    {i.orders} orders
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="admin-card">
        <span className="eyebrow">A note on these numbers</span>
        <h2 className="admin-section-title">
          Not live <em>yet</em>.
        </h2>
        <p
          style={{
            color: 'var(--ink-mid)',
            fontSize: 15,
            maxWidth: '60ch',
            lineHeight: 1.6,
          }}
        >
          For the demo, analytics are derived from your current menu
          (prices and signatures) so you can see the dashboard react as
          you edit. Wire up a Postgres &amp; POS integration, and these
          turn into real service-by-service figures.
        </p>
      </section>
    </div>
  );
}

function Kpi({ label, value, prefix, suffix, decimals, delta, up, down }) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        <AnimatedNumber
          value={value || 0}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals || 0}
        />
      </div>
      <div className={`stat-delta ${up ? 'up' : down ? 'down' : ''}`}>
        {up ? '↑' : down ? '↓' : '→'} {delta}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Small editor primitives used above
   ══════════════════════════════════════════════════════════════ */

function Text({ label, value, onChange, placeholder }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input
        type="text"
        className="input"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 4 }) {
  return (
    <div className="field">
      <label>{label}</label>
      <textarea
        value={value || ''}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        fontSize: 14,
        color: 'var(--ink)',
      }}
    >
      <span
        role="switch"
        aria-checked={value}
        tabIndex={0}
        onClick={() => onChange(!value)}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onChange(!value);
          }
        }}
        style={{
          width: 42,
          height: 24,
          borderRadius: 99,
          background: value ? 'var(--ember)' : 'var(--rule-strong)',
          position: 'relative',
          transition: 'background 0.25s',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: value ? 21 : 3,
            width: 18,
            height: 18,
            borderRadius: 99,
            background: 'var(--paper-mist)',
            transition: 'left 0.25s var(--ease-out)',
            boxShadow: 'var(--lift-1)',
          }}
        />
      </span>
      {label}
    </label>
  );
}

/** Chip-style multi-value editor (ingredients). Enter or comma adds. */
function ChipList({ value, onChange, placeholder = 'Add…' }) {
  const [input, setInput] = useState('');
  const add = () => {
    const v = input.trim();
    if (!v) return;
    onChange([...(value || []), v]);
    setInput('');
  };
  const removeAt = (i) => onChange(value.filter((_, n) => n !== i));

  return (
    <div className="chip-list">
      {value.map((v, i) => (
        <span key={i} className="chip">
          {v}
          <button
            type="button"
            onClick={() => removeAt(i)}
            aria-label={`Remove ${v}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            add();
          } else if (e.key === 'Backspace' && !input && value.length) {
            removeAt(value.length - 1);
          }
        }}
        onBlur={add}
        placeholder={placeholder}
      />
    </div>
  );
}

function ExtrasEditor({ value, onChange, currency }) {
  const add = () =>
    onChange([...(value || []), { name: 'New extra', price: 0 }]);
  const update = (i, patch) =>
    onChange(value.map((x, n) => (n === i ? { ...x, ...patch } : x)));
  const remove = (i) => onChange(value.filter((_, n) => n !== i));

  return (
    <div className="extras-editor">
      {(value || []).map((x, i) => (
        <div key={i} className="extras-row">
          <input
            value={x.name}
            onChange={(e) => update(i, { name: e.target.value })}
            placeholder="Extra name"
          />
          <input
            type="number"
            step="0.5"
            value={x.price}
            onChange={(e) =>
              update(i, { price: parseFloat(e.target.value) || 0 })
            }
            placeholder="0"
            aria-label={`Price in ${currency}`}
          />
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={() => remove(i)}
            aria-label="Remove extra"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-sm btn-ghost"
        onClick={add}
        style={{ alignSelf: 'flex-start' }}
      >
        + Add extra
      </button>
    </div>
  );
}

function ParagraphList({ label, value, onChange }) {
  const update = (i, v) => onChange(value.map((p, n) => (n === i ? v : p)));
  const remove = (i) => onChange(value.filter((_, n) => n !== i));
  const add    = () => onChange([...(value || []), 'A new paragraph.']);

  return (
    <div className="field">
      <label>{label}</label>
      {value.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <textarea
            value={p}
            rows={2}
            onChange={(e) => update(i, e.target.value)}
          />
          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={() => remove(i)}
            aria-label="Remove paragraph"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-sm btn-ghost"
        onClick={add}
        style={{ marginTop: 4 }}
      >
        + Paragraph
      </button>
    </div>
  );
}

function HoursEditor({ value, onChange }) {
  const update = (i, patch) =>
    onChange(value.map((h, n) => (n === i ? { ...h, ...patch } : h)));
  const remove = (i) => onChange(value.filter((_, n) => n !== i));
  const add = () =>
    onChange([...(value || []), { label: 'New day', time: '12:00 – 22:00' }]);

  return (
    <div style={{ marginTop: 8 }}>
      {value.map((h, i) => (
        <div
          key={i}
          style={{ display: 'flex', gap: 8, marginBottom: 8 }}
        >
          <input
            className="input"
            value={h.label}
            onChange={(e) => update(i, { label: e.target.value })}
            placeholder="Day"
          />
          <input
            className="input"
            value={h.time}
            onChange={(e) => update(i, { time: e.target.value })}
            placeholder="Hours"
          />
          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={() => remove(i)}
            aria-label="Remove"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-sm btn-ghost"
        onClick={add}
      >
        + Add row
      </button>
    </div>
  );
}

function ReviewsEditor({ value, onChange }) {
  const update = (i, patch) =>
    onChange(value.map((r, n) => (n === i ? { ...r, ...patch } : r)));
  const remove = (i) => onChange(value.filter((_, n) => n !== i));
  const add = () =>
    onChange([
      ...(value || []),
      { quote: 'A new review.', name: 'Guest name', role: 'City' },
    ]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 12,
      }}
    >
      {value.map((r, i) => (
        <div
          key={i}
          style={{
            padding: 14,
            background: 'var(--paper-soft)',
            border: '1px solid var(--rule)',
            borderRadius: 12,
          }}
        >
          <Textarea
            label="Quote"
            value={r.quote}
            onChange={(v) => update(i, { quote: v })}
            rows={3}
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
            }}
          >
            <Text
              label="Name"
              value={r.name}
              onChange={(v) => update(i, { name: v })}
            />
            <Text
              label="Role / city"
              value={r.role}
              onChange={(v) => update(i, { role: v })}
            />
          </div>
          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={() => remove(i)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-sm btn-ghost"
        onClick={add}
        style={{ alignSelf: 'start' }}
      >
        + Add review
      </button>
    </div>
  );
}
