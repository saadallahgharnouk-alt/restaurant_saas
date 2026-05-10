/**
 * Default content for a new install.
 *
 * Designed for a Moroccan independent restaurant ("Dar Saffran") — edit
 * this once and everything on the site is a reasonable starting point.
 * The admin UI writes over this in localStorage; nothing else needs to
 * change when you rename / rebrand.
 */

export const DEFAULT_CONTENT = {
  brand: {
    name: 'Dar Saffran',
    tagline: 'A Casablanca table.',
    location_city: 'Casablanca',
    location_country: 'Morocco',
    currency: 'DH',
    phone: '+212 522 49 58 11',
    email: 'hello@darsaffran.ma',
    instagram: '@darsaffran',
    logo: '/logo-mark.svg',
  },

  hero: {
    kind: 'video', // 'video' | 'image'
    videoSrc:
      'https://videos.pexels.com/video-files/3957972/3957972-uhd_3840_2160_25fps.mp4',
    videoPoster:
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=80',
    image:
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=80',
    eyebrow: 'Est. 2024 · Hay Hassani',
    title_before: 'Saffron,',
    title_em: 'slow cooking',
    title_after: 'and a grandmother&rsquo;s patience.',
    subtitle:
      'Tagines made on coals. Bread out of the clay oven twice a day. Mint tea poured from a height.',
    cta_primary:  { label: 'See the menu',   href: '/menu' },
    cta_secondary:{ label: 'Find the table', href: '#find' },
  },

  story: {
    eyebrow: 'The story',
    title_before: 'Three generations,',
    title_em: 'one stubborn recipe',
    title_after: '.',
    paragraphs: [
      'Dar Saffran was a Sunday kitchen before it was a restaurant — my grandmother&rsquo;s in Hay Hassani, where the saffron was weighed on a hanging scale, and the lamb came back from the market on a bicycle.',
      'Today we cook the same way: coal, copper, time. Nothing stands in a bain-marie; nothing arrives from a central kitchen. If the artichokes weren&rsquo;t good at Derb Ghallef this morning, the menu changes by lunch.',
      'We opened in 2024 to serve Casablanca food to Casablancans. No tourists&rsquo; menu, no frozen pastilla. Just a small room, a wood oven, and whatever the market gave us.',
    ],
    image:
      'https://images.unsplash.com/photo-1532635241-17e820acc59f?auto=format&fit=crop&w=1200&q=80',
    image_caption: 'Our kitchen, 5 p.m. · prep before service',
  },

  signatures: {
    eyebrow: 'On the table tonight',
    title_before: 'A few',
    title_em: 'small, honest',
    title_after: 'things.',
    subtitle:
      'Three dishes we&rsquo;ll make for you tonight. The full menu lives one scroll away.',
  },

  gallery: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=75',
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=75',
    'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=900&q=75',
    'https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=900&q=75',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=75',
    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=75',
  ],

  reviews: [
    {
      quote:
        'The tagine of the day, eaten at a long table with people I didn&rsquo;t know. I don&rsquo;t usually do that.',
      name: 'Zineb T.',
      role: 'Casablanca',
    },
    {
      quote:
        'A small room, a wood oven, and the best mechoui I&rsquo;ve had outside a family house.',
      name: 'Youssef B.',
      role: 'Rabat, visiting',
    },
    {
      quote:
        'I brought my mother. She asked to meet the cook. That&rsquo;s the review.',
      name: 'Amine L.',
      role: 'Hay Mohammadi',
    },
  ],

  // Hay Hassani, Casablanca — roughly.
  location: {
    line1: '12, Rue Al Manssour Dahbi',
    line2: 'Hay Hassani, Casablanca 20230',
    country: 'Morocco',
    lat: 33.5492,
    lng: -7.6729,
    hours: [
      { label: 'Tuesday – Thursday', time: '12:00 – 15:00 · 19:30 – 23:00' },
      { label: 'Friday – Saturday',  time: '12:00 – 15:30 · 19:30 – 23:30' },
      { label: 'Sunday',             time: '13:00 – 16:00  (family lunch)' },
      { label: 'Monday',             time: 'Closed — market & prep' },
    ],
  },

  // ── Menu ────────────────────────────────────────────────────────
  // Currency is rendered in `brand.currency`. Prices are the pre-tax
  // number — extras add on top. Ingredients is an array of short strings.
  menu: {
    categories: [
      { id: 'starters', name: 'Starters', order: 1 },
      { id: 'tagines',  name: 'Tagines',  order: 2 },
      { id: 'grill',    name: 'Grill',    order: 3 },
      { id: 'sides',    name: 'Sides',    order: 4 },
      { id: 'sweets',   name: 'Sweets',   order: 5 },
      { id: 'drinks',   name: 'Drinks',   order: 6 },
    ],
    items: [
      {
        id: 'zaalouk',
        category: 'starters',
        name: 'Zaalouk',
        price: 45,
        description:
          'Smoked aubergine, tomato confit, new garlic, cumin. Served with house bread.',
        ingredients: ['Aubergine', 'Tomato', 'Garlic', 'Cumin', 'Olive oil'],
        extras: [
          { name: 'Extra bread',        price: 5 },
          { name: 'Double portion',     price: 20 },
        ],
        image:
          'https://images.unsplash.com/photo-1547573854-74d2a71d0826?auto=format&fit=crop&w=800&q=75',
        available: true,
        signature: true,
      },
      {
        id: 'briouates',
        category: 'starters',
        name: 'Briouates',
        price: 55,
        description:
          'Warka pastry parcels — one beef, one chicken, one goat cheese. Three pieces.',
        ingredients: ['Warka', 'Beef', 'Onion', 'Ras el hanout', 'Honey'],
        extras: [{ name: 'Add 3 more', price: 40 }],
        image:
          'https://images.unsplash.com/photo-1625944525533-473f1b3d54a7?auto=format&fit=crop&w=800&q=75',
        available: true,
      },
      {
        id: 'tagine-lamb-plum',
        category: 'tagines',
        name: 'Lamb & prune tagine',
        price: 160,
        description:
          'Shoulder of lamb cooked on coals for five hours, prunes, toasted almonds, sesame.',
        ingredients: ['Lamb shoulder', 'Prunes', 'Almonds', 'Saffron', 'Cinnamon', 'Sesame'],
        extras: [
          { name: 'Extra sauce side', price: 10 },
          { name: 'Couscous grain',   price: 20 },
        ],
        image:
          'https://images.unsplash.com/photo-1633504581786-316c8002b1b9?auto=format&fit=crop&w=800&q=75',
        available: true,
        signature: true,
      },
      {
        id: 'tagine-chicken-lemon',
        category: 'tagines',
        name: 'Chicken &amp; preserved lemon',
        price: 130,
        description:
          'Beldi chicken, green olives, preserved lemon, fresh coriander, ginger.',
        ingredients: ['Chicken', 'Preserved lemon', 'Olives', 'Ginger', 'Coriander'],
        extras: [{ name: 'Add chickpeas', price: 15 }],
        image:
          'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=75',
        available: true,
      },
      {
        id: 'tagine-veg',
        category: 'tagines',
        name: 'Seven-vegetable tagine',
        price: 110,
        description:
          'Slow-cooked: carrot, courgette, turnip, potato, pumpkin, onion, tomato. Vegetarian.',
        ingredients: ['Carrot', 'Courgette', 'Turnip', 'Pumpkin', 'Onion', 'Tomato', 'Smen'],
        extras: [{ name: 'Make it vegan', price: 0 }],
        image:
          'https://images.unsplash.com/photo-1628824851008-4f9acd1d5f5f?auto=format&fit=crop&w=800&q=75',
        available: true,
      },
      {
        id: 'mechoui',
        category: 'grill',
        name: 'Mechoui',
        price: 220,
        description:
          'Shoulder of lamb, salt &amp; cumin, nothing else. Roasted for eight hours. By the quarter kilo.',
        ingredients: ['Lamb shoulder', 'Cumin', 'Salt'],
        extras: [
          { name: 'Half kilo', price: 180 },
          { name: 'Side of peppers', price: 25 },
        ],
        image:
          'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=75',
        available: true,
        signature: true,
      },
      {
        id: 'kefta',
        category: 'grill',
        name: 'Kefta &amp; tomato',
        price: 95,
        description:
          'Seasoned ground beef, grilled, served with a slow tomato sauce and a cracked egg.',
        ingredients: ['Beef', 'Parsley', 'Paprika', 'Tomato', 'Egg'],
        extras: [{ name: 'Spicy harissa', price: 5 }],
        image:
          'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=75',
        available: true,
      },
      {
        id: 'bread',
        category: 'sides',
        name: 'Clay-oven khobz',
        price: 15,
        description:
          'Round country bread, baked twice a day. Comes with olive oil and olives.',
        ingredients: ['Flour', 'Water', 'Salt', 'Natural yeast'],
        extras: [],
        image:
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=75',
        available: true,
      },
      {
        id: 'msemen',
        category: 'sweets',
        name: 'Msemen, honey &amp; butter',
        price: 35,
        description:
          'Flaky laminated pancakes, folded hot, with Atlas honey and fresh farm butter.',
        ingredients: ['Semolina', 'Flour', 'Atlas honey', 'Butter'],
        extras: [{ name: 'Add almond paste', price: 15 }],
        image:
          'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=75',
        available: true,
      },
      {
        id: 'chebakia',
        category: 'sweets',
        name: 'Chebakia',
        price: 30,
        description:
          'Sesame flowers, deep fried, bathed in orange-blossom honey. Three pieces.',
        ingredients: ['Sesame', 'Honey', 'Orange blossom', 'Aniseed'],
        extras: [],
        image:
          'https://images.unsplash.com/photo-1565783350024-f3ffe4a41fb8?auto=format&fit=crop&w=800&q=75',
        available: true,
      },
      {
        id: 'tea',
        category: 'drinks',
        name: 'Mint tea',
        price: 20,
        description:
          'Chinese gunpowder, fresh spearmint, sugar on the side. Poured from a height.',
        ingredients: ['Gunpowder green tea', 'Spearmint', 'Sugar'],
        extras: [
          { name: 'Verbena ("louiza") infusion', price: 5 },
          { name: 'Saffron tea',                 price: 10 },
        ],
        image:
          'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=75',
        available: true,
        signature: true,
      },
      {
        id: 'oj',
        category: 'drinks',
        name: 'Fresh orange juice',
        price: 25,
        description:
          'Pressed to order. Oranges from Taroudant when the season is right.',
        ingredients: ['Orange'],
        extras: [],
        image:
          'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=75',
        available: true,
      },
    ],
  },
};

/** Shallow version key — bump when shape changes so stale localStorage is ignored. */
export const CONTENT_VERSION = 1;
