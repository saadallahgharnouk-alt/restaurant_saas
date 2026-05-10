# RestauHub — Features

This file explains, in plain terms, what each screen does and what changed
in the v2 rework.

---

## 🆕 v2 — Design rework + QR menus

### Brand
- Custom SVG logo set (mark, full logo, favicon, OG card) with an indigo
  gradient, hexagonal frame and a steaming-bowl silhouette.
- Unified CSS design tokens — the old mix of Tailwind-style classes (which
  didn't actually resolve) and hand-rolled CSS has been collapsed into one
  consistent system in `src/App.css`.

### QR Studio (`/qr`)
- **Restaurant picker** that falls back to mock data when the backend is off.
- **Three modes**:
  - *Single* — one universal code per restaurant.
  - *Per-table* — enter a table number; the URL gets `?t=N`.
  - *Bulk* — pick a table count and get 1…N printable cards in a grid with
    a `🖨 Print all` button (a dedicated `@media print` stylesheet hides the
    chrome so only the cards print).
- **Live preview** of the print-ready card: restaurant name, table chip,
  the QR with the RestauHub mark embedded, plus a dashed footer.
- **Actions**: copy URL, download PNG, preview in a new tab.

### Public scan menu (`/m/:restaurantId`)
The screen your guests actually see after scanning.

- Pure mobile-first — no sidebar, no admin chrome.
- Hero header with gradient title, table chip when `?t=N` is present.
- Sticky category bar with pill filters.
- Food cards with thumbnail, description, price, inline `+` / `−` qty.
- Floating bottom pill summarising the cart; tap to open a slide-up drawer.
- Drawer has full cart controls (qty, remove), subtotal + tax + total, and a
  `Send to kitchen` button that `POST`s `/api/orders` with a `table_number`.
- If the backend is offline it still looks/feels right — it falls back to a
  10-item demo menu and shows a success toast locally.

### Table-aware orders
The `table_number` field is now passed all the way through: QR URL
(`?t=5`) → scan page → `POST /api/orders` → row in the `Orders` table.

---

## Admin screens (all restyled)

### `/` — Welcome dashboard
Hero with "Run your restaurant like a SaaS", 4 KPI stat cards, 4 linked
feature tiles (QR / Orders / Analytics / Kitchen), and a CTA card that
deep-links into QR Studio.

### `/restaurants` — Partner directory
(Kept from before — was already in the tokenised system.) Searchable grid
of partner venues with a detail modal.

### `/menu` — Public-style menu preview
Search, category pills, responsive cards with real food photos. Has a
floating cart pill that takes you to `/order`.

### `/menu/manage` — Admin menu management
(Kept.) Add / 86 / edit items with category chips + modal.

### `/kitchen` — Kitchen display
(Kept.) Three columns (Pending / Cooking / Ready) with per-card live timers.

### `/order` — Order cart (admin preview)
Rewritten to use the design tokens: seeded items, qty steppers, promo codes
(`SAVE10`, `SAVE20`, `WELCOME`), subtotal / tax / discount / total,
confirmation banner on checkout.

### `/analytics` — Analytics
Rewritten without `chart.js` — now uses custom CSS bars + gradient
progress bars for top items and a segmented category mix bar.

---

## 📦 What was deleted / simplified

- Old mixed-Tailwind pages that relied on `bg-zinc-900`, `backdrop-blur`
  etc. but had no Tailwind install — replaced with token-based equivalents.
- `MenuQR` was rewritten; it no longer just outputs a bare image — it's a
  proper printable card, driven by `{ restaurant, table }` props, with copy
  URL / download / preview actions.

---

## 🧩 Sample flow

```
Admin /qr  →  pick “La Bella Italia”  →  Per-table → 5
  → Download PNG → print → stick on table 5

Guest scans with phone → lands on /m/1?t=5
  → picks Margherita + Tiramisu → Send to kitchen
  → POST /api/orders { restaurant_id: 1, table_number: 5, … }

Staff opens /kitchen  →  new ticket appears in Pending column
```

That's the entire QR loop, from the paper on the table to the printer in
the kitchen.
