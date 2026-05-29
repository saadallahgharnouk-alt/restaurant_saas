// ─── Hand-rolled validator helpers ───────────────────────────────────────────

function isString(v) {
  return typeof v === "string";
}

function isNumber(v) {
  return typeof v === "number" && !Number.isNaN(v);
}

function isInteger(v) {
  return Number.isInteger(v);
}

function isBoolean(v) {
  return typeof v === "boolean";
}

function isArray(v) {
  return Array.isArray(v);
}

function isObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

// ─── Validation logic ────────────────────────────────────────────────────────

function fail(path, message) {
  return { valid: false, error: `${path}: ${message}` };
}

function ok(value) {
  return { valid: true, value };
}

function validateString(value, path, { min = 0, max = Infinity } = {}) {
  if (!isString(value)) return fail(path, "must be a string");
  if (value.length < min) return fail(path, `must be at least ${min} characters`);
  if (value.length > max) return fail(path, `must be at most ${max} characters`);
  return null;
}

function validateLogoUrl(value, path) {
  if (!isString(value)) return fail(path, "must be a string");
  if (value === "") return null;
  if (value.startsWith("https://")) return null;
  if (/^data:image\/[^;]+;base64,/.test(value)) return null;
  return fail(path, "must be empty, https://, or data:image/*;base64,...");
}

function validateBranding(branding, basePath) {
  if (!isObject(branding)) return fail(basePath, "must be an object");
  let err;
  err = validateString(branding.restaurantName, `${basePath}.restaurantName`, { min: 1, max: 80 });
  if (err) return err;
  err = validateString(branding.tagline, `${basePath}.tagline`, { min: 0, max: 160 });
  if (err) return err;
  err = validateLogoUrl(branding.logoUrl, `${basePath}.logoUrl`);
  if (err) return err;
  return null;
}

function validateFeature(feature, path) {
  if (!isObject(feature)) return fail(path, "must be an object");
  let err;
  err = validateString(feature.eyebrow, `${path}.eyebrow`);
  if (err) return err;
  if (!isString(feature.title) || feature.title.trim().length === 0)
    return fail(`${path}.title`, "required and must be non-empty");
  if (!isString(feature.body) || feature.body.trim().length === 0)
    return fail(`${path}.body`, "required and must be non-empty");
  if (!isArray(feature.bullets)) return fail(`${path}.bullets`, "must be an array");
  if (feature.bullets.length > 4) return fail(`${path}.bullets`, "must have at most 4 items");
  for (let i = 0; i < feature.bullets.length; i++) {
    const b = feature.bullets[i];
    if (!isObject(b)) return fail(`${path}.bullets[${i}]`, "must be an object");
    if (!isString(b.strong)) return fail(`${path}.bullets[${i}].strong`, "must be a string");
    if (!isString(b.rest)) return fail(`${path}.bullets[${i}].rest`, "must be a string");
  }
  if (feature.ctaLabel !== undefined && !isString(feature.ctaLabel))
    return fail(`${path}.ctaLabel`, "must be a string if provided");
  if (feature.ctaHref !== undefined && !isString(feature.ctaHref))
    return fail(`${path}.ctaHref`, "must be a string if provided");
  if (!isString(feature.imageUrl)) return fail(`${path}.imageUrl`, "must be a string");
  return null;
}

function validateLanding(landing, basePath) {
  if (!isObject(landing)) return fail(basePath, "must be an object");
  let err;
  err = validateString(landing.heroHeadline, `${basePath}.heroHeadline`, { min: 4, max: 140 });
  if (err) return err;
  err = validateString(landing.heroLead, `${basePath}.heroLead`, { min: 20, max: 400 });
  if (err) return err;
  if (!isString(landing.heroImageUrl)) return fail(`${basePath}.heroImageUrl`, "must be a string");
  if (!isArray(landing.marqueeItems)) return fail(`${basePath}.marqueeItems`, "must be an array");
  if (landing.marqueeItems.length < 1) return fail(`${basePath}.marqueeItems`, "must have at least 1 item");
  for (let i = 0; i < landing.marqueeItems.length; i++) {
    if (!isString(landing.marqueeItems[i]))
      return fail(`${basePath}.marqueeItems[${i}]`, "must be a string");
  }
  if (!isArray(landing.features)) return fail(`${basePath}.features`, "must be an array");
  if (landing.features.length > 6)
    return fail(`${basePath}.features`, "must have at most 6 items");
  for (let i = 0; i < landing.features.length; i++) {
    err = validateFeature(landing.features[i], `${basePath}.features[${i}]`);
    if (err) return err;
  }

  // Story (optional but defaulted in DEFAULT_CONTENT)
  if (landing.story !== undefined) {
    if (!isObject(landing.story)) return fail(`${basePath}.story`, "must be an object");
    err = validateString(landing.story.eyebrow, `${basePath}.story.eyebrow`, { min: 0, max: 80 });
    if (err) return err;
    err = validateString(landing.story.title, `${basePath}.story.title`, { min: 0, max: 140 });
    if (err) return err;
    err = validateString(landing.story.body, `${basePath}.story.body`, { min: 0, max: 1200 });
    if (err) return err;
    if (!isString(landing.story.imageUrl))
      return fail(`${basePath}.story.imageUrl`, "must be a string");
  }

  // Gallery (optional, max 8 images)
  if (landing.gallery !== undefined) {
    if (!isArray(landing.gallery)) return fail(`${basePath}.gallery`, "must be an array");
    if (landing.gallery.length > 8) return fail(`${basePath}.gallery`, "must have at most 8 items");
    for (let i = 0; i < landing.gallery.length; i++) {
      if (!isString(landing.gallery[i]))
        return fail(`${basePath}.gallery[${i}]`, "must be a string");
    }
  }

  return null;
}

function validateLocation(location, basePath) {
  if (!isObject(location)) return fail(basePath, "must be an object");
  if (!isString(location.address)) return fail(`${basePath}.address`, "must be a string");
  if (location.latitude !== null) {
    if (!isNumber(location.latitude) || location.latitude < -90 || location.latitude > 90)
      return fail(`${basePath}.latitude`, "must be a number between -90 and 90, or null");
  }
  if (location.longitude !== null) {
    if (!isNumber(location.longitude) || location.longitude < -180 || location.longitude > 180)
      return fail(`${basePath}.longitude`, "must be a number between -180 and 180, or null");
  }
  if (!isString(location.embedUrl)) return fail(`${basePath}.embedUrl`, "must be a string");
  if (location.embedUrl !== "" && !/^https:\/\/www\.google\.com\/maps\/embed\?/.test(location.embedUrl))
    return fail(`${basePath}.embedUrl`, "must be empty or match https://www.google.com/maps/embed?...");
  return null;
}

const TIME_RE = /^\d{2}:\d{2}$/;

function validateContact(contact, basePath) {
  if (!isObject(contact)) return fail(basePath, "must be an object");
  if (!isString(contact.phoneNumber)) return fail(`${basePath}.phoneNumber`, "must be a string");
  if (!isString(contact.whatsappNumber)) return fail(`${basePath}.whatsappNumber`, "must be a string");
  let err;
  err = validateString(contact.whatsappGreeting, `${basePath}.whatsappGreeting`, { min: 0, max: 280 });
  if (err) return err;
  if (!isString(contact.whatsappCtaLabel)) return fail(`${basePath}.whatsappCtaLabel`, "must be a string");
  if (!isArray(contact.hours)) return fail(`${basePath}.hours`, "must be an array");
  for (let i = 0; i < contact.hours.length; i++) {
    const h = contact.hours[i];
    const hp = `${basePath}.hours[${i}]`;
    if (!isObject(h)) return fail(hp, "must be an object");
    if (!isString(h.day)) return fail(`${hp}.day`, "must be a string");
    if (!isString(h.open) || !TIME_RE.test(h.open)) return fail(`${hp}.open`, "must be HH:MM format");
    if (!isString(h.close) || !TIME_RE.test(h.close)) return fail(`${hp}.close`, "must be HH:MM format");
    if (!isBoolean(h.closed)) return fail(`${hp}.closed`, "must be a boolean");
  }
  return null;
}

function validateMenu(menu, basePath) {
  if (!isObject(menu)) return fail(basePath, "must be an object");
  if (!isArray(menu.categories)) return fail(`${basePath}.categories`, "must be an array");
  for (let i = 0; i < menu.categories.length; i++) {
    const c = menu.categories[i];
    const cp = `${basePath}.categories[${i}]`;
    if (!isObject(c)) return fail(cp, "must be an object");
    if (!isString(c.id)) return fail(`${cp}.id`, "must be a string");
    let err = validateString(c.name, `${cp}.name`, { min: 1, max: 40 });
    if (err) return err;
    if (!isString(c.slug)) return fail(`${cp}.slug`, "must be a string");
    if (!isNumber(c.order)) return fail(`${cp}.order`, "must be a number");
  }
  if (!isArray(menu.items)) return fail(`${basePath}.items`, "must be an array");
  for (let i = 0; i < menu.items.length; i++) {
    const item = menu.items[i];
    const ip = `${basePath}.items[${i}]`;
    if (!isObject(item)) return fail(ip, "must be an object");
    if (!isString(item.id)) return fail(`${ip}.id`, "must be a string");
    if (item.categoryId !== null && !isString(item.categoryId))
      return fail(`${ip}.categoryId`, "must be a string or null");
    let err = validateString(item.name, `${ip}.name`, { min: 1, max: 80 });
    if (err) return err;
    err = validateString(item.description, `${ip}.description`, { min: 0, max: 400 });
    if (err) return err;
    if (!isInteger(item.priceCents) || item.priceCents < 0 || item.priceCents > 10000000)
      return fail(`${ip}.priceCents`, "must be an integer between 0 and 10000000");
    if (!["MAD", "EUR", "USD"].includes(item.currency))
      return fail(`${ip}.currency`, 'must be "MAD", "EUR", or "USD"');
    if (!isArray(item.ingredients)) return fail(`${ip}.ingredients`, "must be an array");
    for (let j = 0; j < item.ingredients.length; j++) {
      err = validateString(item.ingredients[j], `${ip}.ingredients[${j}]`, { min: 1, max: 40 });
      if (err) return err;
    }
    if (!isString(item.photoUrl)) return fail(`${ip}.photoUrl`, "must be a string");
    if (!isBoolean(item.active)) return fail(`${ip}.active`, "must be a boolean");
  }
  return null;
}

/**
 * Validate a CMS content object.
 * @param {unknown} content
 * @returns {{ valid: true, value: object } | { valid: false, error: string }}
 */
export function validate(content) {
  if (!isObject(content)) return fail("content", "must be an object");

  let err;
  err = validateBranding(content.branding, "branding");
  if (err) return err;
  err = validateLanding(content.landing, "landing");
  if (err) return err;
  err = validateLocation(content.location, "location");
  if (err) return err;
  err = validateContact(content.contact, "contact");
  if (err) return err;
  err = validateMenu(content.menu, "menu");
  if (err) return err;

  return ok(content);
}

// ─── DEFAULT_CONTENT ─────────────────────────────────────────────────────────

export const DEFAULT_CONTENT = {
  branding: {
    restaurantName: "Dar Saffron",
    tagline: "Modern Moroccan Kitchen",
    logoUrl: "",
  },
  landing: {
    heroHeadline: "Flavours of Morocco, served with soul.",
    heroLead:
      "From the spice markets of Marrakech to your plate. Slow-cooked tagines, hand-rolled couscous, fresh-baked breads and a glass of mint tea waiting at the door. We can't wait to host you.",
    heroImageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80",
    marqueeItems: [
      "Tagine",
      "Couscous",
      "Pastilla",
      "Harira",
      "Msemen",
      "Mint Tea",
      "Halal",
      "Fresh daily",
    ],
    story: {
      eyebrow: "Our story",
      title: "Three generations of recipes, one warm room.",
      body:
        "Dar Saffron started as a family kitchen in the medina, where Grandma Fatima would feed the whole street on Friday afternoons. Today we're still cooking her recipes \u2014 the same lemon-and-olive chicken tagine, the same hand-rolled couscous on Friday, the same pot of mint tea bubbling at the back. The room is bigger now, the saffron is just as good.",
      imageUrl:
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80",
    },
    features: [
      {
        eyebrow: "The kitchen",
        title: "Slow food, the way it should be.",
        body:
          "Every tagine simmers for at least four hours. Our bread is baked twice a day in a wood-fired oven. The harissa is pounded by hand. We don't take shortcuts because the food doesn't taste right when you do.",
        bullets: [
          { strong: "Daily", rest: "spices ground in-house, never pre-mixed" },
          { strong: "Halal", rest: "certified, fully traceable supply chain" },
          { strong: "Seasonal", rest: "vegetables from farms within 80 km" },
        ],
        ctaLabel: "See the menu",
        ctaHref: "/menu",
        imageUrl:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1400&q=80",
      },
      {
        eyebrow: "The room",
        title: "Hand-painted zellige, low lanterns, room to breathe.",
        body:
          "We built the room the way we'd want to eat in one. Banquettes deep enough for a long lunch, music low enough to talk over, light warm enough to make everyone look their best. Bring your in-laws. Bring a first date. Bring yourself and a book.",
        bullets: [
          { strong: "60 seats", rest: "indoor, plus a 20-seat rooftop terrace" },
          { strong: "Private", rest: "back room available for groups up to 16" },
          { strong: "Open", rest: "every day from lunch through late dinner" },
        ],
        imageUrl:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80",
      },
      {
        eyebrow: "Order ahead",
        title: "Tap a button. Pick it up. Done.",
        body:
          "Don't feel like cooking tonight? Message us on WhatsApp with what you'd like and we'll have it boxed up and ready when you arrive \u2014 usually in under thirty minutes. No app to download, no account to create.",
        bullets: [
          { strong: "WhatsApp", rest: "ordering with a real person on the other end" },
          { strong: "Pickup", rest: "ready in 25-35 minutes, most days" },
          { strong: "Family", rest: "platters that feed 4-6 with one click" },
        ],
        ctaLabel: "Message us now",
        ctaHref: "/menu",
        imageUrl:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1400&q=80",
      },
      {
        eyebrow: "Visit us",
        title: "We're easier to find than you think.",
        body:
          "Two minutes from the tram stop, five minutes from the parking garage on Rue Mohamed V. The blue door with the lantern above it is us. Walk in, take a deep breath, you're already at the table.",
        bullets: [
          { strong: "Walk-ins", rest: "always welcome \u2014 reservations recommended on weekends" },
          { strong: "Step-free", rest: "entry and accessible bathroom" },
        ],
        ctaLabel: "Get directions",
        ctaHref: "#find-us",
        imageUrl:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1539136788836-5699e78bfc75?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1432139509613-5c4255815697?auto=format&fit=crop&w=900&q=80",
    ],
  },
  location: {
    address: "Rue Mohamed V, Casablanca, Morocco",
    latitude: 33.5731,
    longitude: -7.5898,
    embedUrl: "",
  },
  contact: {
    phoneNumber: "+212 5XX-XXXXXX",
    whatsappNumber: "+212600000000",
    whatsappGreeting: "Hello! I'd like to place an order.",
    whatsappCtaLabel: "Order on WhatsApp",
    hours: [
      { day: "Monday", open: "11:00", close: "23:00", closed: false },
      { day: "Tuesday", open: "11:00", close: "23:00", closed: false },
      { day: "Wednesday", open: "11:00", close: "23:00", closed: false },
      { day: "Thursday", open: "11:00", close: "23:00", closed: false },
      { day: "Friday", open: "11:00", close: "23:00", closed: false },
      { day: "Saturday", open: "11:00", close: "23:00", closed: false },
      { day: "Sunday", open: "11:00", close: "23:00", closed: false },
    ],
  },
  menu: {
    categories: [
      { id: "cat-starters", name: "Starters", slug: "starters", order: 0 },
      { id: "cat-mains", name: "Mains", slug: "mains", order: 1 },
      { id: "cat-desserts", name: "Desserts", slug: "desserts", order: 2 },
      { id: "cat-drinks", name: "Drinks", slug: "drinks", order: 3 },
    ],
    items: [
      {
        id: "item-001",
        categoryId: "cat-starters",
        name: "Harira Soup",
        description: "Traditional Moroccan tomato and lentil soup with chickpeas, fresh herbs, and a squeeze of lemon.",
        priceCents: 3500,
        currency: "MAD",
        ingredients: ["Tomatoes", "Lentils", "Chickpeas", "Cilantro", "Lemon"],
        photoUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
        active: true,
      },
      {
        id: "item-002",
        categoryId: "cat-starters",
        name: "Briouats au Fromage",
        description: "Crispy phyllo triangles stuffed with herbed goat cheese and drizzled with honey.",
        priceCents: 4200,
        currency: "MAD",
        ingredients: ["Phyllo dough", "Goat cheese", "Herbs", "Honey"],
        photoUrl: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=900&q=80",
        active: true,
      },
      {
        id: "item-003",
        categoryId: "cat-starters",
        name: "Zaalouk",
        description: "Smoky eggplant and tomato dip seasoned with cumin, garlic, and olive oil, served with warm bread.",
        priceCents: 3000,
        currency: "MAD",
        ingredients: ["Eggplant", "Tomatoes", "Garlic", "Cumin", "Olive oil"],
        photoUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80",
        active: true,
      },
      {
        id: "item-004",
        categoryId: "cat-mains",
        name: "Chicken Tagine with Preserved Lemons",
        description: "Slow-cooked chicken with preserved lemons, green olives, and a blend of Moroccan spices over fluffy couscous.",
        priceCents: 8500,
        currency: "MAD",
        ingredients: ["Chicken", "Preserved lemons", "Olives", "Saffron", "Couscous"],
        photoUrl: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=900&q=80",
        active: true,
      },
      {
        id: "item-005",
        categoryId: "cat-mains",
        name: "Lamb Mrouzia",
        description: "Tender lamb shoulder braised with raisins, almonds, honey, and ras el hanout in a rich aromatic sauce.",
        priceCents: 12000,
        currency: "MAD",
        ingredients: ["Lamb", "Raisins", "Almonds", "Honey", "Ras el hanout"],
        photoUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
        active: true,
      },
      {
        id: "item-006",
        categoryId: "cat-mains",
        name: "Vegetable Couscous Royale",
        description: "Hand-rolled semolina couscous steamed and served with seven seasonal vegetables and spiced broth.",
        priceCents: 7000,
        currency: "MAD",
        ingredients: ["Couscous", "Carrots", "Zucchini", "Turnips", "Chickpeas"],
        photoUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
        active: true,
      },
      {
        id: "item-007",
        categoryId: "cat-desserts",
        name: "Pastilla au Lait",
        description: "Layers of crispy warqa pastry with creamy milk custard, cinnamon, and toasted almonds.",
        priceCents: 4500,
        currency: "MAD",
        ingredients: ["Warqa pastry", "Milk", "Almonds", "Cinnamon", "Sugar"],
        photoUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
        active: true,
      },
      {
        id: "item-008",
        categoryId: "cat-desserts",
        name: "Chebakia",
        description: "Flower-shaped sesame cookies deep-fried and soaked in honey syrup with orange blossom water.",
        priceCents: 3800,
        currency: "MAD",
        ingredients: ["Sesame", "Honey", "Orange blossom water", "Flour"],
        photoUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=80",
        active: true,
      },
      {
        id: "item-009",
        categoryId: "cat-drinks",
        name: "Moroccan Mint Tea",
        description: "Fresh spearmint leaves steeped with Chinese gunpowder green tea, sweetened and poured from height.",
        priceCents: 2500,
        currency: "MAD",
        ingredients: ["Green tea", "Spearmint", "Sugar"],
        photoUrl: "https://images.unsplash.com/photo-1565799912018-d24d6e6f7d12?auto=format&fit=crop&w=900&q=80",
        active: true,
      },
      {
        id: "item-010",
        categoryId: "cat-drinks",
        name: "Avocado Smoothie",
        description: "Creamy blend of ripe avocado, milk, and a touch of honey \u2014 a Moroccan caf\u00e9 staple.",
        priceCents: 3000,
        currency: "MAD",
        ingredients: ["Avocado", "Milk", "Honey"],
        photoUrl: "https://images.unsplash.com/photo-1638176066740-87bcec92daed?auto=format&fit=crop&w=900&q=80",
        active: true,
      },
      {
        id: "item-011",
        categoryId: "cat-drinks",
        name: "Fresh Orange Juice",
        description: "Freshly squeezed Moroccan oranges, served chilled with no added sugar.",
        priceCents: 2000,
        currency: "MAD",
        ingredients: ["Oranges"],
        photoUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=900&q=80",
        active: true,
      },
    ],
  },
};

// ─── Serialization / Deserialization ─────────────────────────────────────────

/**
 * Serialize content to a JSON string.
 * @param {object} content
 * @returns {string}
 */
export function serialize(content) {
  return JSON.stringify(content);
}

/**
 * Deserialize a JSON string to content. Throws if invalid JSON or schema validation fails.
 * @param {string} jsonString
 * @returns {object} - validated content
 */
export function deserialize(jsonString) {
  if (typeof jsonString !== "string") {
    throw new Error("deserialize: input must be a string");
  }
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    throw new Error(`deserialize: invalid JSON - ${e.message}`);
  }
  const result = validate(parsed);
  if (!result.valid) {
    throw new Error(`deserialize: validation failed - ${result.error}`);
  }
  return result.value;
}


// ─── Round-Trip Integrity (Req 18) ───────────────────────────────────────────

/**
 * Assert round-trip: deserialize(serialize(c)) deep-equals c.
 * @param {object} content - a valid CMS_Content value
 * @returns {{ ok: true } | { ok: false, error: string }}
 */
export function assertRoundTrip(content) {
  try {
    const serialized = serialize(content);
    const deserialized = deserialize(serialized);
    if (serialize(deserialized) !== serialized) {
      return { ok: false, error: "Round-trip failed: deserialize(serialize(c)) !== c" };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: `Round-trip threw: ${e.message}` };
  }
}

/**
 * Assert serializer idempotence: serialize(deserialize(serialize(c))) === serialize(c).
 * @param {object} content - a valid CMS_Content value
 * @returns {{ ok: true } | { ok: false, error: string }}
 */
export function assertIdempotence(content) {
  try {
    const s1 = serialize(content);
    const d1 = deserialize(s1);
    const s2 = serialize(d1);
    if (s1 !== s2) {
      return { ok: false, error: "Idempotence failed: serialize(deserialize(serialize(c))) !== serialize(c)" };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: `Idempotence threw: ${e.message}` };
  }
}

/**
 * Assert all Menu_Item IDs are distinct.
 * @param {object} content - a valid CMS_Content value
 * @returns {{ ok: true } | { ok: false, error: string }}
 */
export function assertUniqueItemIds(content) {
  const ids = (content?.menu?.items || []).map((i) => i.id);
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) {
      return { ok: false, error: `Duplicate menu item id: "${id}"` };
    }
    seen.add(id);
  }
  return { ok: true };
}

/**
 * Assert referential integrity: every item with a non-null categoryId
 * references an existing category.
 * @param {object} content - a valid CMS_Content value
 * @returns {{ ok: true } | { ok: false, error: string }}
 */
export function assertReferentialIntegrity(content) {
  const categoryIds = new Set((content?.menu?.categories || []).map((c) => c.id));
  const items = content?.menu?.items || [];
  for (const item of items) {
    if (item.categoryId !== null && !categoryIds.has(item.categoryId)) {
      return {
        ok: false,
        error: `Item "${item.name}" (${item.id}) references non-existent category "${item.categoryId}"`,
      };
    }
  }
  return { ok: true };
}

/**
 * Run all integrity checks. Use after any CMS editor operation.
 * @param {object} content - a valid CMS_Content value
 * @returns {{ ok: true } | { ok: false, errors: string[] }}
 */
export function assertIntegrity(content) {
  const checks = [
    assertRoundTrip(content),
    assertIdempotence(content),
    assertUniqueItemIds(content),
    assertReferentialIntegrity(content),
  ];
  const failures = checks.filter((c) => !c.ok);
  if (failures.length === 0) return { ok: true };
  return { ok: false, errors: failures.map((f) => f.error) };
}
