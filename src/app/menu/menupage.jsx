import React, { useState, useRef, useEffect } from 'react';

const CATEGORIES = ['All', 'Mains', 'Sides', 'Desserts', 'Drinks'];

const CAT_COLORS = {
  Mains:    { bg: 'rgba(99,102,241,0.1)',  color: '#818cf8', border: 'rgba(99,102,241,0.25)' },
  Sides:    { bg: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
  Desserts: { bg: 'rgba(236,72,153,0.1)', color: '#f472b6', border: 'rgba(236,72,153,0.25)' },
  Drinks:   { bg: 'rgba(34,197,94,0.1)',  color: '#4ade80', border: 'rgba(34,197,94,0.25)' },
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
  const [form, setForm] = useState(item || { name: '', category: 'Mains', price: '', available: true, desc: '' });
  const ref = useRef(null);
  useEffect(() => ref.current?.focus(), []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const save = () => {
    if (!form.name.trim() || !form.price) return;
    onSave({ ...form, price: parseFloat(form.price), id: form.id || nextId++ });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: 480, padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <span className="page-tag" style={{ margin: 0 }}>
            {item ? 'EDIT ITEM' : 'NEW ITEM'}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'NAME', key: 'name', type: 'text', ph: 'e.g. Margherita Pizza', ref },
            { label: 'DESCRIPTION', key: 'desc', type: 'text', ph: 'Short description…' },
            { label: 'PRICE ($)', key: 'price', type: 'number', ph: '0.00' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-mid)', letterSpacing: '0.12em', display: 'block', marginBottom: 6 }}>
                {f.label}
              </label>
              <input
                ref={f.ref}
                type={f.type}
                value={form[f.key]}
                placeholder={f.ph}
                onChange={e => set(f.key, e.target.value)}
                className="input"
                style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', color: 'var(--text-hi)' }}
              />
            </div>
          ))}

          <div>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-mid)', letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>
              CATEGORY
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORIES.filter(c => c !== 'All').map(c => {
                const cc = CAT_COLORS[c];
                const active = form.category === c;
                return (
                  <button key={c} onClick={() => set('category', c)} className={`btn btn-sm ${active ? 'btn-primary' : 'btn-ghost'}`} style={{
                    background: active ? cc.bg : 'transparent',
                    borderColor: active ? cc.border : 'var(--border)',
                    color: active ? cc.color : 'var(--text-mid)',
                  }}>{c}</button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px' }}>
            <span style={{ fontSize: 13, color: 'var(--text)' }}>Available to order</span>
            <button onClick={() => set('available', !form.available)} style={{
              width: 40, height: 22, borderRadius: 99, border: 'none', cursor: 'pointer',
              background: form.available ? 'var(--green)' : 'var(--surface)',
              transition: 'background 0.2s',
              position: 'relative',
            }}>
              <span style={{
                position: 'absolute', top: 3, left: form.available ? 20 : 3,
                width: 16, height: 16, borderRadius: '50%', background: '#fff',
                transition: 'left 0.2s',
              }} />
            </button>
          </div>

          <button onClick={save} className="btn btn-primary" style={{ marginTop: 4 }}>
            {item ? 'Save Changes' : 'Add Item'}
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
  const [modal, setModal]       = useState(null); // null | 'new' | item
  const [editItem, setEditItem] = useState(null);

  const filtered = items.filter(i =>
    (cat === 'All' || i.category === cat) &&
    (i.name.toLowerCase().includes(search.toLowerCase()) || i.desc.toLowerCase().includes(search.toLowerCase()))
  );

  const save = (item) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === item.id);
      return idx >= 0 ? prev.map((i, n) => n === idx ? item : i) : [...prev, item];
    });
  };

  const toggle = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, available: !i.available } : i));
  const remove = (id) => setItems(prev => prev.filter(i => i.id !== id));

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="page-tag">◍ Menu</span>
          <h1 className="page-title">Menu Management</h1>
          <p className="page-sub">{items.length} items · {items.filter(i => i.available).length} available</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditItem(null); setModal('new'); }}>+ Add Item</button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 24, padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            className="input"
            placeholder="Search menu…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 240, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-hi)' }}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)} className={`btn btn-sm ${cat === c ? 'btn-primary' : 'btn-ghost'}`} style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
              }}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid-3 stagger">
        {filtered.map((item, i) => {
          const cc = CAT_COLORS[item.category];
          return (
            <div key={item.id} className="card" style={{
              animationDelay: `${i * 0.05}s`,
              opacity: item.available ? 1 : 0.55,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-hi)', letterSpacing: '-0.2px' }}>
                      {item.name}
                    </h3>
                    {!item.available && <span className="badge badge-red">86'd</span>}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span className="badge" style={{
                  background: cc.bg, border: `1px solid ${cc.border}`,
                  color: cc.color,
                }}>
                  {item.category.toUpperCase()}
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--text-hi)', letterSpacing: '-0.5px' }}>
                  ${item.price.toFixed(2)}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                <button onClick={() => toggle(item.id)} className="btn btn-ghost btn-sm" style={{ flex: 1 }}>
                  {item.available ? '⊘ 86 It' : '✓ Restore'}
                </button>
                <button onClick={() => { setEditItem(item); setModal('edit'); }} className="btn btn-ghost btn-sm">
                  Edit
                </button>
                <button onClick={() => remove(item.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }}>
                  ✕
                </button>
              </div>
            </div>
          );
        })}

        {/* Add placeholder */}
        <button onClick={() => { setEditItem(null); setModal('new'); }} className="card" style={{
          background: 'transparent',
          border: '1px dashed var(--border)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 8, cursor: 'pointer', minHeight: 160,
          color: 'var(--text-mid)',
        }}>
          <span style={{ fontSize: 24 }}>+</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em' }}>ADD ITEM</span>
        </button>
      </div>

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
