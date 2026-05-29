# Restaurant Site

A modern restaurant website with a built-in **manager edit screen**. The
owner can change every text, photo, dish, address, phone number and
opening hour from the browser — no code required.

## What's on the site

| Path     | Page                                            |
| -------- | ----------------------------------------------- |
| `/`      | Public landing — hero, about, dish preview, map |
| `/menu`  | Public menu — categories, dishes, search        |
| `/admin` | Manager edit screen (login required)            |

That's it. No table-side QR studio, no order kitchen board, no analytics.

## Manager edit screen (`/admin`)

Default login: `admin` / `admin` (override via `VITE_ADMIN_CREDENTIALS`).

Sections the manager can edit:

- **Branding** — restaurant name, tagline, logo
- **Home page** — hero headline + paragraph + photo, highlight pills,
  feature rows (each with photo + title + body + bullets + optional CTA)
- **Menu categories** — Starters / Mains / Desserts / etc., reorderable
- **Dishes** — name, photo, price + currency (MAD / EUR / USD),
  description, ingredient pills, hidden/visible toggle
- **Location & map** — address + latitude/longitude (auto-generates a
  Google Maps embed) or paste an embed URL directly
- **Contact** — phone, WhatsApp number, WhatsApp greeting & button
  label, opening hours per day

Every field that takes an image has a built-in upload control
(PNG/JPEG/WebP, max 2 MB).

## How it persists

The CMS first tries to talk to the backend at `/api/content`. If the
backend is unreachable, it falls back to **localStorage** in the
manager's browser. Image uploads work the same way: the backend stores
files under `backend/data/uploads/`, but if it's offline the image is
embedded as a base64 data URI directly into the saved content.

This means **the site is fully runnable with the frontend alone**, which
is great for static-host deploys (Vercel, Netlify, GitHub Pages). The
backend only matters once you want photos to persist on a server
instead of inside the manager's browser.

## Running locally

```bash
# 1. Install deps
npm install

# 2. (Optional) Start the CMS backend on :5000
npm run server

# 3. Start the frontend on :5173
npm run dev
```

Open `http://localhost:5173/` for the site, `/menu` for the menu, and
`/admin` to log in and start editing.

## Built with

React 19 · Vite · React Router 7 · Express 5 · Multer · plain CSS
(no Tailwind, no UI kit, no animation libraries).
