# Restaurant Website & CMS

A restaurant website with a searchable menu and a browser-based editor. Guests can browse dishes by category, look up an ingredient, or contact the restaurant on WhatsApp. A manager can update the menu, photos, location, and opening hours from the editor.

**Stack** · React 19, Vite, React Router, Express 5, Multer, and CSS

![RestauHub menu with dish search, category filters, and prices](docs/menu.webp)

## Try it locally

Use Node.js 22.12 or newer.

```bash
npm ci
npm run dev
```

Open [localhost:5173](http://localhost:5173). The app starts with sample restaurant content, and the frontend can run on its own.

| Page | What to try |
| --- | --- |
| [`/`](http://localhost:5173/) | Browse the homepage, featured dishes, and restaurant details. |
| [`/menu`](http://localhost:5173/menu) | Search for a dish or ingredient and switch between categories. |
| [`/admin`](http://localhost:5173/admin) | Sign in with the local demo account (`admin` / `admin`), change the restaurant name under **Branding**, and save. Return to the menu to see the change. |

To preview the production build locally, run `npm run build` followed by `npm run preview`.

To store edits on disk, run `npm run server` in a second terminal. The frontend uses `http://localhost:5000` by default. See [`.env.example`](.env.example) for configuration. The browser-only sign-in is intended for local demos. A public deployment would need server-side authentication and authorization for content changes and uploads.

## How it works

- One schema defines branding, landing page sections, menu categories and dishes, location, and contact details. [Content model](src/lib/content-schema.js)
- React context shares content between the public pages and the editor. The store loads from the API and falls back to browser storage or the bundled sample content. Edits made without the API stay in the current browser. [Frontend content store](src/lib/content-store.jsx)
- `GET /api/content` loads saved edits and `PUT /api/content` writes them to a JSON file. The upload endpoint accepts PNG, JPEG, and WebP files up to 2 MiB, and the upload control can embed an image as a data URL when the API is unavailable. [Express CMS API](backend/server.js) · [Upload control](src/components/MediaUpload.jsx)

See the [feature list](FEATURES.md) for details on the editor, Google Maps, and WhatsApp integration.
