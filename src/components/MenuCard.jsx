import React from 'react';

const FALLBACK_DISH =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80';

/**
 * MenuCard — clean dish card driven entirely by CMS Menu_Item shape:
 *   { name, description, priceCents, currency, photoUrl, ingredients[] }
 */
export default function MenuCard({ item }) {
  if (!item) return null;

  const photo = item.photoUrl?.trim() || FALLBACK_DISH;
  const price = formatPrice(item.priceCents, item.currency);

  return (
    <article className="menu-card">
      <div className="menu-card-photo">
        <img src={photo} alt={item.name} loading="lazy" />
      </div>

      <div className="menu-card-body">
        <div className="menu-card-head">
          <h3 className="menu-card-name">{item.name}</h3>
          <div className="menu-card-price">{price}</div>
        </div>

        {item.description && (
          <p className="menu-card-desc">{item.description}</p>
        )}

        {item.ingredients?.length > 0 && (
          <ul className="menu-card-ingredients" aria-label="Ingredients">
            {item.ingredients.slice(0, 5).map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

function formatPrice(cents, currency) {
  const value = ((cents || 0) / 100).toFixed(2);
  if (currency === 'EUR') return `€${value}`;
  if (currency === 'USD') return `$${value}`;
  return `${value} MAD`;
}
