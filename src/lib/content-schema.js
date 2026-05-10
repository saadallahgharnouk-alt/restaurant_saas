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

function validateUrl(value, path, { allowEmpty = true, pattern = null } = {}) {
  if (!isString(value)) return fail(path, "must be a string");
  if (value === "" && allowEmpty) return null;
  if (pattern && !pattern.test(value)) return fail(path, "invalid URL format");
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
  if (landing.features.length < 3 || landing.features.length > 6)
    return fail(`${basePath}.features`, "must have 3-6 items");
  for (let i = 0; i < landing.features.length; i++) {
    err = validateFeature(landing.features[i], `${basePath}.features[${i}]`);
    if (err) return err;
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
    restaurantName: "RestauHub",
    tagline: "Modern Moroccan Kitchen",
    logoUrl: "",
  },
  landing: {
    heroHeadline: "Flavors of Morocco, served with soul.",
    heroLead:
      "From the bustling souks of Marrakech to your plate \u2014 we bring authentic Moroccan recipes crafted with locally-sourced spices, slow-cooked traditions, and a modern touch that celebrates every bite.",
    heroImageUrl: "",
    marqueeItems: ["Tagine", "Couscous", "Pastilla", "Harira", "Msemen", "Mint Tea"],
    features: [
      {
        eyebrow: "Our Menu",
        title: "A journey through Moroccan flavors",
        body: "Explore our curated selection of traditional dishes reimagined for the modern palate, from slow-simmered tagines to hand-rolled couscous.",
        bullets: [
          { strong: "Seasonal", rest: "ingredients sourced from local farms" },
          { strong: "Halal", rest: "certified preparation for every dish" },
        ],
        ctaLabel: "View Menu",
        ctaHref: "/menu",
        imageUrl: "",
      },
      {
        eyebrow: "Service",
        title: "Seamless ordering, faster service",
        body: "Scan the QR code at your table, browse the menu, and place your order instantly \u2014 no waiting, no friction, just great food arriving fast.",
        bullets: [
          { strong: "QR-powered", rest: "table ordering in seconds" },
          { strong: "Real-time", rest: "kitchen display for faster prep" },
        ],
        ctaLabel: "How It Works",
        ctaHref: "/qr",
        imageUrl: "",
      },
      {
        eyebrow: "Experience",
        title: "Where tradition meets modern dining",
        body: "Step into a space that blends Moroccan craftsmanship with contemporary design \u2014 warm zellige tiles, handwoven textiles, and the aroma of cumin and saffron in the air.",
        bullets: [
          { strong: "Private", rest: "dining rooms for special occasions" },
          { strong: "Rooftop", rest: "terrace with sunset views" },
        ],
        imageUrl: "",
      },
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
        photoUrl: "",
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
        photoUrl: "",
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
        photoUrl: "",
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
        photoUrl: "",
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
        photoUrl: "",
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
        photoUrl: "",
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
        photoUrl: "",
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
        photoUrl: "",
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
        photoUrl: "",
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
        photoUrl: "",
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
        photoUrl: "",
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
