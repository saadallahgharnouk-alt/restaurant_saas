# RestauHub — Restaurant OS

A modern, single-page restaurant management app: **QR menus**, live orders, a
kitchen display board, and analytics — all in one lightweight dashboard.
Guests scan a printed QR code at their table, the menu opens on their phone,
and their order flies straight to the kitchen.

---

## What's new in this rework

- **Rebrand**: new hex+bowl+steam logo set (SVG) and a tightened indigo
  colour system. Favicon, dark navbar, OG card, everything refreshed.
- **Consistent design system**: the entire app is now on the custom CSS
  tokens in `App.css` — the old half-Tailwind pages have been rewritten so
  every screen finally matches.
- **🆕 QR Studio (`/qr`)**: admin page that generates a print-ready QR
  card for each restaurant. Single / per-table / bulk modes, with a live
  preview and a print stylesheet.
- **🆕 Public scan menu (`/m/:restaurantId`)**: customer-facing, mobile-first
  menu that the QR points at. No admin shell, sticky category bar, floating
  cart CTA, slide-up drawer, offline-safe with a rich demo menu.
- **Table-aware orders**: the scan URL can carry `?t=5` and the order POSTed
  to the kitchen is tagged with `table_number`.
- **Better admin dashboard**: 4 KPI cards, feature tiles, and a CTA that
  deep-links into QR Studio.

---

## 🗺️ Route map

### Admin (inside `EnhancedLayout`)

| Path                | Page                                             |
|---------------------|--------------------------------------------------|
| `/`                 | Welcome dashboard with feature tiles             |
| `/restaurants`      | Partner directory (mock data)                    |
| `/menu`             | Public-style menu with filters + floating cart   |
| `/menu/manage`      | Admin menu management (add / 86 / edit items)    |
| `/kitchen`          | Kitchen display system (KDS)                     |
| `/order`            | Order cart with promo codes                      |
| `/analytics`        | Revenue / top items / category mix               |
| `/qr`               | **QR Studio** — generate and print QR menus      |

### Public (no admin shell)

| Path                         | Page                                |
|------------------------------|-------------------------------------|
| `/m/:restaurantId`           | Public scan menu (whole restaurant) |
| `/m/:restaurantId?t=5`       | Same, tagged for table #5           |

---

## 🔲 QR code flow

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  /qr studio  │──→  │  guest scans QR  │──→  │  /m/:id[?t=N]   │
│  (admin)     │     │  (phone camera)  │     │  mobile menu    │
└──────────────┘     └──────────────────┘     └────────┬────────┘
                                                       │
                                                       ▼
                                            ┌──────────────────┐
                                            │ POST /api/orders │
                                            │ table_number: N  │
                                            └──────────────────┘
```

1. Manager opens **`/qr`**, picks a restaurant, picks a mode
   (Single / Per-table / Bulk), downloads a PNG or prints the whole sheet.
2. Guest scans → their phone opens `/m/:restaurantId?t=5`.
3. They pick items, tap "Send to kitchen", and the order hits the
   `/api/orders` endpoint already tagged with the table number.

The QR uses `qr-code-styling` with a rounded dot style, indigo corners, and
the RestauHub mark embedded in the middle.

---

## 🚀 Tech stack

- **Frontend**: React 19, Vite, React Router 7, `qr-code-styling`
- **Backend**: Node / Express 5 + PostgreSQL (`pg`)
- **Styling**: custom CSS design tokens (no Tailwind, no framer-motion)
- **Assets**: pure SVG logos + favicon

---

## 🏃 Run it

```bash
# backend (port 5000)
cd backend
node server.js

# frontend (port 5173)
npm install
npm run dev
```

Open `http://localhost:5173/` for the admin app, and
`http://localhost:5173/m/1` to preview the customer scan page.

### Offline mode

Both the admin app and the scan menu are **offline-safe**: if the backend
isn't running, the UI falls back to mock restaurants and a built-in demo
menu, so you can click through the whole flow without a DB.

---

## 🗄️ Schema note

Orders now carry an optional `table_number`. If your existing DB doesn't
have this column yet, add it with:

```sql
ALTER TABLE "Orders" ADD COLUMN table_number INTEGER NULL;
```

---

## 🔌 API surface

| Method | Path                            | Purpose                        |
|--------|---------------------------------|--------------------------------|
| `GET`  | `/api/restaurants`              | List all partner restaurants   |
| `GET`  | `/api/restaurants/:id`          | Single restaurant (scan page)  |
| `GET`  | `/api/menu/:restaurantId`       | Menu items for a restaurant    |
| `GET`  | `/api/orders`                   | Recent orders (admin)          |
| `POST` | `/api/orders`                   | Place an order (with `table_number`) |

---

Made for fast, friendly service. Scan → tap → eat. 🍽️
