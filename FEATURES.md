# Feature list

## Public site

### Home page (`/`)

- Hero — large photo + serif headline + lead paragraph (all editable)
- Two prominent CTAs in the hero: **View the Menu** and **Order on
  WhatsApp**
- Highlight pills under the hero (e.g. "Halal", "Fresh", "Seasonal")
- About / feature rows with photos, titles, paragraphs and bulleted
  benefits — fully editable, you can add or remove rows as you like
- Dish preview strip — auto-pulls the first three visible dishes from
  the menu, with photo + name + description + price
- **Find us** section — Google Maps embed on the left, address +
  phone + WhatsApp button + opening hours on the right

### Menu (`/menu`)

- Category tabs (Starters / Mains / etc.) sourced from the CMS,
  reorderable
- Search box across name, description and ingredients
- Two-column dish cards with photo, name, price, description, and
  up to five ingredient pills
- Floating WhatsApp button to order without leaving the menu

### Site nav and footer

- Sticky top nav with restaurant name + logo, Home / Menu links, and a
  WhatsApp button always visible
- Footer with brand block, address, phone, WhatsApp, and a per-day
  opening hours table

### WhatsApp integration

- Reads phone number, greeting and button label from the CMS
- Builds a `wa.me/<digits>?text=<urlencoded greeting>` link
- Hides itself when no valid number is set (so the site never shows a
  broken button)

### Map integration

- Reads address + latitude + longitude from the CMS
- If the manager pasted a Google Maps `embed?...` URL, it uses that
  exactly; otherwise it builds a default embed from the coordinates;
  if neither is set, falls back to a Morocco overview
- "Get directions" link below the map opens Google Maps in a new tab

## Manager edit screen (`/admin`)

- Username / password login, 12-hour session, default `admin / admin`
- Sidebar navigation between sections, status banner showing
  Saved / Saving / Unsaved / Offline state
- All edits are reflected on the public pages immediately

### What can be edited

| Section          | Fields                                                                                                                  |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Branding         | Restaurant name, tagline, logo image                                                                                    |
| Home page        | Hero headline, hero paragraph, hero image; highlight pills (list); feature rows (each: eyebrow, title, body, bullets, CTA, image) |
| Menu categories  | Add / rename / reorder / delete categories (with referential-integrity warnings on delete)                              |
| Dishes           | Add / edit / delete dishes; name, description, price (cents), currency, photo, ingredient list, visible/hidden toggle   |
| Location & map   | Address, latitude, longitude, optional custom Google Maps embed URL, with live preview                                  |
| Contact          | Phone number, WhatsApp number (auto-prefixed with +212 if it starts with 0), WhatsApp greeting, button label, hours per day |

### Image uploads

- Built-in upload control on every image field
- Accepts PNG / JPEG / WebP, maximum 2 MB
- Uploads to the backend when available, and embeds the image as a
  base64 data URI in the saved content otherwise

## Persistence

Both content and images are persisted with a layered fallback:

1. Backend `PUT /api/content` and `POST /api/content/media`
2. Frontend `localStorage` with a versioned key
3. Default content shipped with the app (Moroccan restaurant scaffold)

The frontend will load whichever layer it can reach, in priority order,
so the site is never empty.

## Removed in this release

- Per-table QR menus
- Customer-facing scan menu
- Kitchen display board
- Order cart / order submission flow
- Restaurant directory
- Manager dashboard, analytics dashboard
- All animation primitives (HeroCanvas, MagneticButton, TiltCard,
  AnimatedNumber, Marquee, Reveal, GrainOverlay)
