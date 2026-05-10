import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection failed X', err.stack);
  } else {
    console.log('Connected to PostgreSQL');
  }
  if (client) release();
});

app.get('/', (req, res) => {
  res.send('RestauHub backend running');
});

app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1');
    res.json({ test: 'ok', data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/restaurants', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Restaurants" ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get a single restaurant by id (used by the public /m/:id scan page
// so the customer sees the restaurant name / branding).
app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM "Restaurants" WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Restaurant fetch error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/menu/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const result = await pool.query(
      'SELECT * FROM "Menu_Items" WHERE restaurant_id = $1',
      [restaurantId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Menu fetch error:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// List all orders (used by the admin dashboard).
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM "Orders" ORDER BY id DESC LIMIT 100'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Orders fetch error:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { restaurant_id, items, total_price, table_number } = req.body;

    const result = await pool.query(
      `INSERT INTO "Orders" (restaurant_id, items, total_price, status, table_number)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [restaurant_id, JSON.stringify(items), total_price, 'Pending', table_number || null]
    );

    res.json({ success: true, message: 'Order sent to kitchen!', order: result.rows[0] });
  } catch (err) {
    console.error('Order submission error:', err.message);
    res.status(500).json({ error: 'Failed to submit order' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// CMS Content API (Req 14)
// Persists CMS content to a local JSON file.
// ═══════════════════════════════════════════════════════════════════════════════

const CONTENT_FILE = path.join(__dirname, 'data', 'content.json');
const UPLOADS_DIR = path.join(__dirname, 'data', 'uploads');

// Ensure data directories exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded media files statically
app.use('/uploads', express.static(UPLOADS_DIR));

/**
 * GET /api/content — returns the full CMS content JSON.
 */
app.get('/api/content', (req, res) => {
  try {
    if (!fs.existsSync(CONTENT_FILE)) {
      return res.status(404).json({ error: 'No content saved yet' });
    }
    const raw = fs.readFileSync(CONTENT_FILE, 'utf8');
    const content = JSON.parse(raw);
    res.json(content);
  } catch (err) {
    console.error('Content read error:', err.message);
    res.status(500).json({ error: 'Failed to read content' });
  }
});

/**
 * PUT /api/content — saves the full CMS content JSON.
 */
app.put('/api/content', (req, res) => {
  try {
    const content = req.body;
    if (!content || typeof content !== 'object') {
      return res.status(400).json({ error: 'Body must be a JSON object' });
    }
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf8');
    res.json({ success: true, message: 'Content saved' });
  } catch (err) {
    console.error('Content write error:', err.message);
    res.status(500).json({ error: 'Failed to save content' });
  }
});

/**
 * POST /api/content/media — upload a media file (image).
 * Accepts multipart/form-data with field name "file".
 * Returns { url: "/uploads/filename.ext" }
 */
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname) || '.jpg';
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
      cb(null, name);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MiB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Accepted: PNG, JPEG, WebP.`));
    }
  },
});

app.post('/api/content/media', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large. Maximum: 2 MB.' });
      }
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }
    const url = `/uploads/${req.file.filename}`;
    res.json({ url, filename: req.file.filename });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
