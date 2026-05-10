import React, { useEffect, useMemo, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Reveal } from '../components/primitives';
import { useContent } from '../store/content';

/* ─────────────────────────────────────────────────────────────────
   Public menu (/menu). Group items by category, sticky category
   chips, and a big "Scan the menu" QR block at the bottom so guests
   can take the link home / share with a friend.
   ───────────────────────────────────────────────────────────────── */

export default function PublicMenu() {
  const c = useContent();
  const currency = c.brand.currency || '$';

  const categories = useMemo(() => {
    const cats = (c.menu.categories || [])
      .slice()
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    // only show categories that have at least one available item
    const usedIds = new Set(
      (c.menu.items || []).filter((i) => i.available).map((i) => i.category)
    );
    return cats.filter((cat) => usedIds.has(cat.id));
  }, [c.menu]);

  const items = useMemo(
    () => (c.menu.items || []).filter((i) => i.available),
    [c.menu.items]
  );

  const byCat = useMemo(() => {
    const m = new Map();
    for (const cat of categories) m.set(cat.id, []);
    for (const item of items) {
      if (!m.has(item.category)) m.set(item.category, []);
      m.get(item.category).push(item);
    }
    return m;
  }, [items, categories]);

  const [active, setActive] = useState(categories[0]?.id || null);

  // Sync active pill with what's on screen while the user scrolls.
  useEffect(() => {
    const sections = categories
      .map((c) => document.getElementById(`cat-${c.id}`))
      .filter(Boolean);
    if (sections.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
          .forEach((e) => {
            const id = e.target.id.replace(/^cat-/, '');
            setActive(id);
          });
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0.1, 0.25, 0.5] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [categories]);

  const scrollTo = (id) => {
    const el = document.getElementById(`cat-${id}`);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <div className="menu-page">
      <Reveal as="div" className="page-header">
        <span className="eyebrow">The menu</span>
        <h1 className="page-title">
          {c.brand.name}&rsquo;s <em>table</em>.
        </h1>
        <p className="page-sub">
          Everything we&rsquo;re cooking today. {items.length} dishes.
          Prices in <strong>{currency}</strong>, service included.
        </p>
      </Reveal>

      {/* Sticky category chips */}
      <div className="menu-catbar">
        <div className="menu-catbar-inner">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => scrollTo(cat.id)}
              className={`menu-cat ${active === cat.id ? 'active' : ''}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Category sections */}
      {categories.map((cat) => {
        const list = byCat.get(cat.id) || [];
        if (!list.length) return null;
        return (
          <section key={cat.id} id={`cat-${cat.id}`}>
            <h2 className="menu-section-title">
              <em>{cat.name}</em>
            </h2>

            <Reveal stagger className="menu-grid stagger">
              {list.map((item) => (
                <DishRow key={item.id} item={item} currency={currency} />
              ))}
            </Reveal>
          </section>
        );
      })}

      {/* ─── QR block at the end ─────────────────────────── */}
      <MenuQrBlock brandName={c.brand.name} />
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── */

function DishRow({ item, currency }) {
  return (
    <article className="menu-dish">
      {item.image ? (
        <img src={item.image} alt={item.name} className="menu-dish-img" />
      ) : (
        <div
          className="menu-dish-img"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--ink-faint)',
            letterSpacing: '0.1em',
          }}
        >
          NO PHOTO
        </div>
      )}

      <div className="menu-dish-body">
        <div className="menu-dish-head">
          <h3 className="menu-dish-name">
            <span dangerouslySetInnerHTML={{ __html: item.name }} />
            {item.signature && <span className="sig">SIGNATURE</span>}
          </h3>
          <span className="menu-dish-price">
            {currency} {item.price}
          </span>
        </div>

        {item.description && (
          <p className="menu-dish-desc">{item.description}</p>
        )}

        {item.ingredients?.length > 0 && (
          <div className="menu-dish-ingredients">
            {item.ingredients.slice(0, 7).map((g, i) => (
              <span key={i}>{g}</span>
            ))}
          </div>
        )}

        {item.extras?.length > 0 && (
          <div className="menu-dish-extras">
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--ink-faint)',
              }}
            >
              Extras
            </span>
            <ul>
              {item.extras.map((x, i) => (
                <li key={i}>
                  <span>{x.name}</span>
                  <span style={{ color: 'var(--ember-deep)' }}>
                    + {currency} {x.price}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}

/* ─── QR block ──────────────────────────────────────────────── */

function MenuQrBlock({ brandName }) {
  const hostRef = useRef(null);
  const qrRef   = useRef(null);
  const [copied, setCopied] = useState(false);

  const url = useMemo(() => {
    if (typeof window === 'undefined') return '/menu';
    return window.location.origin + '/menu';
  }, []);

  useEffect(() => {
    if (!hostRef.current) return;
    qrRef.current = new QRCodeStyling({
      width: 200,
      height: 200,
      type: 'canvas',
      data: url,
      margin: 6,
      dotsOptions:          { color: '#1C1814', type: 'rounded' },
      cornersSquareOptions: { color: '#942A18', type: 'extra-rounded' },
      cornersDotOptions:    { color: '#D25A35', type: 'dot' },
      backgroundOptions:    { color: '#FFFBF1' },
      imageOptions: { crossOrigin: 'anonymous', margin: 3, imageSize: 0.22 },
      image: '/logo-mark.svg',
    });
    hostRef.current.innerHTML = '';
    qrRef.current.append(hostRef.current);
  }, [url]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* ignore */ }
  };

  const download = () => {
    const safe = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    qrRef.current?.download({ name: `menu-${safe}`, extension: 'png' });
  };

  return (
    <Reveal className="menu-qr-block">
      <div className="qr-host" ref={hostRef} />
      <div>
        <span className="eyebrow">QR</span>
        <h3>
          Take this menu <em>home</em>.
        </h3>
        <p>
          Scan it, save it, share it. It always points at the live menu —
          as we change what we cook, this updates.
        </p>

        <div className="url-row">
          <code>{url}</code>
          <button
            className={`btn btn-sm ${copied ? 'btn-ember' : 'btn-ghost'}`}
            onClick={copy}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={download}>
            Save PNG
          </button>
        </div>
      </div>
    </Reveal>
  );
}
