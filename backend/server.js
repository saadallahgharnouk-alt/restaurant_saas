import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;

const app = express();
app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
