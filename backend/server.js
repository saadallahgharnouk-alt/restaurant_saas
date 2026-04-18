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
    console.error('Database connection failed ❌', err.stack);
  } else {
    console.log('Connected to PostgreSQL ✅');
  }
  if (client) release();
});

app.get('/', (req, res) => {
  res.send('RestauHub backend running 🚀');
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

// --- NEW ROUTE: Get menu for ONE specific restaurant ---
app.get('/api/menu/:restaurantId', async (req, res) => {
  try {
    // We grab the ID from the URL React asked for
    const { restaurantId } = req.params; 
    
    // The $1 is a security measure to prevent hackers from messing with the database
    const result = await pool.query(
      'SELECT * FROM "Menu_Items" WHERE restaurant_id = $1', 
      [restaurantId]
    );
    
    res.json(result.rows); 
  } catch (err) {
    console.error("Menu fetch error:", err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// --- NEW ROUTE: Submit a new order ---
app.post('/api/orders', async (req, res) => {
  try {
    // We grab the cart data that React sent us in the "body" of the request
    const { restaurant_id, items, total_price } = req.body;

    // Insert it into the Orders table! 
    const result = await pool.query(
      `INSERT INTO "Orders" (restaurant_id, items, total_price, status) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [restaurant_id, JSON.stringify(items), total_price, 'Pending']
    );

    res.json({ success: true, message: 'Order sent to kitchen!', order: result.rows[0] });
  } catch (err) {
    console.error("Order submission error:", err.message);
    res.status(500).json({ error: 'Failed to submit order' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
