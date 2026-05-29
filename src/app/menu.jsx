import React, { useMemo, useState } from 'react';
import { useContent } from '../lib/content-store';
import WhatsAppCTA from '../components/WhatsAppCTA';
import MenuCard from '../components/MenuCard';

/**
 * Customer menu page — entirely CMS-driven.
 * Shows categories from content.menu.categories and items from
 * content.menu.items where item.active === true.
 */
export default function MenuPage() {
  const { content } = useContent();
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch]       = useState('');

  const branding = content?.branding;
  const contact  = content?.contact;
  const menu     = content?.menu;

  const categories = useMemo(() => {
    const list = [...(menu?.categories || [])];
    list.sort((a, b) => a.order - b.order);
    return list;
  }, [menu]);

  const visibleItems = useMemo(() => {
    const items = (menu?.items || []).filter((it) => it.active !== false);
    return items;
  }, [menu]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return visibleItems.filter((item) => {
      if (activeCat !== 'all' && item.categoryId !== activeCat) return false;
      if (!q) return true;
      const haystack = `${item.name} ${item.description} ${(item.ingredients || []).join(' ')}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [visibleItems, activeCat, search]);

  // Group filtered items by category for "All" view
  const grouped = useMemo(() => {
    const groups = new Map();
    for (const cat of categories) groups.set(cat.id, []);
    groups.set('__uncategorized__', []);

    for (const item of filtered) {
      const key = item.categoryId && groups.has(item.categoryId)
        ? item.categoryId
        : '__uncategorized__';
      groups.get(key).push(item);
    }
    return groups;
  }, [filtered, categories]);

  if (!content) {
    return (
      <div className="page">
        <div className="loading">Loading menu&hellip;</div>
      </div>
    );
  }

  const restaurantName = branding?.restaurantName || 'our menu';

  return (
    <div className="page menu-page">
      {/* Header */}
      <header className="menu-header">
        <span className="eyebrow">The menu</span>
        <h1 className="menu-title">A meal at {restaurantName}</h1>
        <p className="menu-sub">
          {visibleItems.length} dish{visibleItems.length === 1 ? '' : 'es'} on the menu today.
          Order via WhatsApp or call ahead to reserve.
        </p>

        <div className="menu-actions">
          <WhatsAppCTA contact={contact} />
        </div>
      </header>

      {/* Filter bar */}
      <div className="menu-filter">
        <div className="menu-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes, ingredients&hellip;"
            aria-label="Search the menu"
          />
        </div>

        <div className="menu-cats" role="tablist">
          <button
            type="button"
            className={`menu-cat ${activeCat === 'all' ? 'is-active' : ''}`}
            onClick={() => setActiveCat('all')}
            role="tab"
            aria-selected={activeCat === 'all'}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`menu-cat ${activeCat === cat.id ? 'is-active' : ''}`}
              onClick={() => setActiveCat(cat.id)}
              role="tab"
              aria-selected={activeCat === cat.id}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Items */}
      {filtered.length === 0 ? (
        <div className="menu-empty">
          <span className="menu-empty-mark" aria-hidden>◇</span>
          <p>
            {search.trim()
              ? `No dishes match "${search}".`
              : 'No dishes in this category yet.'}
          </p>
          {search.trim() && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setSearch('')}
            >
              Clear search
            </button>
          )}
        </div>
      ) : activeCat === 'all' ? (
        // Grouped by category
        <div className="menu-groups">
          {categories.map((cat) => {
            const items = grouped.get(cat.id) || [];
            if (items.length === 0) return null;
            return (
              <section key={cat.id} className="menu-group">
                <h2 className="menu-group-title">{cat.name}</h2>
                <div className="menu-grid">
                  {items.map((item) => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            );
          })}
          {(grouped.get('__uncategorized__') || []).length > 0 && (
            <section className="menu-group">
              <h2 className="menu-group-title">More</h2>
              <div className="menu-grid">
                {grouped.get('__uncategorized__').map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        // Single category — flat grid
        <div className="menu-grid">
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Floating WhatsApp button on menu */}
      <div className="menu-floating-cta">
        <WhatsAppCTA contact={contact} label="Order on WhatsApp" />
      </div>
    </div>
  );
}
