import React, { useState, useRef, useEffect } from 'react';
import { Reveal } from '../../components/primitives';

const CATEGORIES = ['All', 'Mains', 'Sides', 'Desserts', 'Drinks'];

const CAT_COLORS = {
  Mains:    '#B13D2A',
  Sides:    '#D4932E',
  Desserts: '#6B3D5C',
  Drinks:   '#6B8E5A',
};

const INITIAL_ITEMS = [
  { id: 1, name: 'Margherita Pizza',  category: 'Mains',    price: 12.99, available: true,  desc: 'San Marzano tomato, buffalo mozzarella, basil' },
  { id: 2, name: 'Spicy Tuna Roll',   category: 'Mains',    price: 8.99,  available: true,  desc: 'Fresh tuna, sriracha mayo, cucumber, avocado' },
  { id: 3, name: 'Garlic Bread',      category: 'Sides',    price: 5.50,  available: false, desc: 'House sourdough, roasted garlic butter, herbs' },
  { id: 4, name: 'Tiramisu',          category: 'Desserts', price: 7.00,  available: true,  desc: 'Classic Italian with mascarpone and espresso' },
  { id: 5, name: 'Sparkling Water',   category: 'Drinks',   price: 3.50,  available: true,  desc: '330ml San Pellegrino' },
  { id: 6, name: 'Caesar Salad',      category: 'Sides',    price: 8.00,  available: true,  desc: 'Romaine, parmesan, house dressing, croutons' },
];

let nextId = 7;

function Modal({ item, onClose, onSave }) {
  const [form, setForm] = useState(
    item || {
      name: '',
      category: 'Mains',
      price: '',
      available: true,
      desc: '',
    }
  );
  const ref = useRef(null);
  useEffect(() => ref.current?.focus(), []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const save = () => {
    if (!form.name.trim() || !form.price) return;
    onSave({ ...form, price: parseFloat(form.price), id: form.id || nextId++ });
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <span className="eyebrow">
          {item ? 'Edit item' : 'New item'}
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            fontWeight: 440,
            letterSpacing: '-0.025em',
            marginTop: 6,
            marginBottom: 22,
            color: 'var(--ink)',
          }}
        >
          {item ? 'Refining a dish' : <>Add a <em style={{ color: 'var(--ember-deep)', fontStyle: 'italic', fontWeight: 380 }}>new</em> dish</>}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Name', key: 'name', type: 'text', ph: 'e.g. Margherita Pizza', ref },
            { label: 'Description', key: 'desc', type: 'text', ph: 'Short description…' },
            { label: 'Price ($)', key: 'price', type: 'number', ph: '0.00' },
          ].map((f) => (
            <div key={f.key}>
              <label
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--ink-faint)',
                  letterSpacing: '0.14em',
                  display: 'block',
                  marginBottom: 6,
                  textTransform: 'uppercase',
                }}
              >
                {f.label}
              </label>
              <input
                ref={f.ref}
                type={f.type}
                value={form[f.key]}
                placeholder={f.ph}
                onChange={(e) => set(f.key, e.target.value)}
                className="input"
              />
            </div>
          ))}

          <div>
            <label
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--ink-faint)',
                letterSpacing: '0.14em',
                display: 'block',
                marginBottom: 8,
                textTransform: 'uppercase',
              }}
            >
              Category
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORIES.filter((c) => c !== 'All').map((c) => {
                const active = form.category === c;
                return (
                  <button
                    key={c}
                    onClick={() => set('category', c)}
                    className={`btn btn-sm ${active ? 'btn-ember' : 'btn-ghost'}`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--paper-soft)',
              border: '1px solid var(--rule)',
              borderRadius: 12,
              padding: '14px 16px',
            }}
          >
            <span style={{ fontSize: 14, color: 'var(--ink-soft)' }}>
              Available to order
            </span>
            <button
              onClick={() => set('available', !form.available)}
              style={{
                width: 42,
                height: 24,
                borderRadius: 99,
                border: 'none',
                cursor: 'pointer',
                background: form.available ? 'var(--sage)' : 'var(--rule-strong)',
                transition: 'background 0.25s',
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 3,
                  left: form.available ? 21 : 3,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: 'var(--paper-mist)',
                  transition: 'left 0.25s var(--ease-out)',
                  boxShadow: 'var(--lift-1)',
                }}
              />
            </button>
          </div>

          <button
            onClick={save}
            className="btn btn-ember btn-arrow"
            style={{
              marginTop: 8,
              padding: '14px 20px',
              justifyContent: 'center',
            }}
          >
            {item ? 'Save changes' : 'Add item'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MenuManagement() {
  const [items, setItems]       = useState(INITIAL_ITEMS);
  const [cat, setCat]           = useState('All');
  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState(null);
  const [editItem, setEditItem] = useState(null);

  const filtered = items.filter(
    (i) =>
      (cat === 'All' || i.category === cat) &&
      (i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.desc.toLowerCase().includes(search.toLowerCase()))
  );

  const save = (item) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      return idx >= 0
        ? prev.map((i, n) => (n === idx ? item : i))
        : [...prev, item];
    });
  };

  const toggle = (id) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, available: !i.available } : i))
    );
  const remove = (id) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <div className="page">
      <Reveal
        as="div"
        className="page-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <span className="eyebrow">Menu management</span>
          <h1 className="page-title">
            Curate the <em>kitchen&rsquo;s voice</em>.
          </h1>
          <p className="page-sub">
            {items.length} items &middot;{' '}
            {items.filter((i) => i.available).length} available now
          </p>
        </div>
        <button
          className="btn btn-ember btn-arrow"
          onClick={() => {
            setEditItem(null);
            setModal('new');
          }}
        >
          Add dish
        </button>
      </Reveal>

      {/* Filters */}
      <Reveal>
        <div className="card" style={{ marginBottom: 28, padding: '16px 20px' }}>
          <div
            style={{
              display: 'flex',
              gap: 14,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <input
              className="input"
              placeholder="Search the menu…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: 280 }}
            />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`btn btn-sm ${cat === c ? 'btn-ember' : 'btn-ghost'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Items grid */}
      <Reveal stagger className="grid-3 stagger">
        {filtered.map((item) => {
          const color = CAT_COLORS[item.category] || 'var(--ember-deep)';
          return (
            <div
              key={item.id}
              className="card"
              style={{
                opacity: item.available ? 1 : 0.65,
                transition: 'opacity 0.3s',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 12,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 6,
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 19,
                        fontWeight: 500,
                        color: 'var(--ink)',
                        letterSpacing: '-0.018em',
                      }}
                    >
                      {item.name}
                    </h3>
                    {!item.available && (
                      <span className="badge badge-ember" style={{ fontSize: 10 }}>
                        86&rsquo;d
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: 'var(--ink-mid)',
                      lineHeight: 1.55,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: 99,
                    background: 'var(--paper-soft)',
                    border: `1px solid ${color}44`,
                    color,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.category}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 24,
                    fontWeight: 500,
                    color: 'var(--ember-deep)',
                    letterSpacing: '-0.025em',
                  }}
                >
                  ${item.price.toFixed(2)}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  borderTop: '1px solid var(--rule)',
                  paddingTop: 14,
                }}
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="btn btn-ghost btn-sm"
                  style={{ flex: 1 }}
                >
                  {item.available ? '86 it' : 'Restore'}
                </button>
                <button
                  onClick={() => {
                    setEditItem(item);
                    setModal('edit');
                  }}
                  className="btn btn-ghost btn-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(item.id)}
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--ember-deep)' }}
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}

        {/* Add placeholder */}
        <button
          onClick={() => {
            setEditItem(null);
            setModal('new');
          }}
          className="card"
          style={{
            background: 'transparent',
            border: '1px dashed var(--rule-strong)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            cursor: 'pointer',
            minHeight: 200,
            color: 'var(--ink-mid)',
          }}
        >
          <span style={{ fontSize: 28, color: 'var(--ember)' }}>+</span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Add item
          </span>
        </button>
      </Reveal>

      {(modal === 'new' || modal === 'edit') && (
        <Modal
          item={modal === 'edit' ? editItem : null}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </div>
  );
}
