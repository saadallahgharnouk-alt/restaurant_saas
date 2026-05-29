import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

/* ────────────────────────────────────────────────────────────────────────
   Restaurant SaaS — backend
   Two responsibilities only:
     1. Persist CMS content as a JSON file       (GET / PUT /api/content)
     2. Receive image uploads                    (POST /api/content/media)

   The frontend gracefully falls back to localStorage + base64 data URIs
   when this server is not running, so it's optional in development.
   ──────────────────────────────────────────────────────────────────────── */

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const DATA_DIR     = path.join(__dirname, 'data');
const UPLOADS_DIR  = path.join(DATA_DIR, 'uploads');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');

if (!fs.existsSync(DATA_DIR))    fs.mkdirSync(DATA_DIR,    { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));

/* ─── Health ─────────────────────────────────────────────────────────── */

app.get('/', (req, res) => {
  res.json({ ok: true, service: 'restaurant-cms-backend' });
});

/* ─── CMS content ────────────────────────────────────────────────────── */

app.get('/api/content', (req, res) => {
  try {
    if (!fs.existsSync(CONTENT_FILE)) {
      return res.status(404).json({ error: 'No content saved yet' });
    }
    const raw = fs.readFileSync(CONTENT_FILE, 'utf8');
    res.json(JSON.parse(raw));
  } catch (err) {
    console.error('Content read error:', err.message);
    res.status(500).json({ error: 'Failed to read content' });
  }
});

app.put('/api/content', (req, res) => {
  try {
    const content = req.body;
    if (!content || typeof content !== 'object') {
      return res.status(400).json({ error: 'Body must be a JSON object' });
    }
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf8');
    res.json({ success: true });
  } catch (err) {
    console.error('Content write error:', err.message);
    res.status(500).json({ error: 'Failed to save content' });
  }
});

/* ─── Media upload ───────────────────────────────────────────────────── */

const ACCEPTED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
      const ext  = path.extname(file.originalname) || '.jpg';
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
      cb(null, name);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MiB
  fileFilter: (req, file, cb) => {
    if (ACCEPTED_TYPES.has(file.mimetype)) return cb(null, true);
    cb(new Error(`Invalid file type: ${file.mimetype}. Accepted: PNG, JPEG, WebP.`));
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
    res.json({
      url:      `/uploads/${req.file.filename}`,
      filename: req.file.filename,
    });
  });
});

/* ─── Boot ───────────────────────────────────────────────────────────── */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`CMS backend listening on http://localhost:${PORT}`);
});
