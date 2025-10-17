const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'charityevents_db',
  port: process.env.DB_PORT || 3306
});

db.connect(err => {
  if (err) console.error('Database connect error:', err);
  else console.log('Connected to MySQL');
});

app.use(express.static(path.join(__dirname, 'public')));

// GET /api/events - all upcoming events
app.get('/api/events', (req, res) => {
  const sql = 'SELECT e.*, c.name AS category_name FROM charity_events e LEFT JOIN categories c ON e.category_id = c.id ORDER BY e.event_date ASC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET /api/events/search?date=&location=&category_id=
app.get('/api/events/search', (req, res) => {
  const { date, location, category_id } = req.query;
  let sql = 'SELECT e.*, c.name AS category_name FROM charity_events e LEFT JOIN categories c ON e.category_id = c.id WHERE 1=1';
  const params = [];
  if (date) { sql += ' AND event_date = ?'; params.push(date); }
  if (location) { sql += ' AND location LIKE ?'; params.push('%' + location + '%'); }
  if (category_id) { sql += ' AND category_id = ?'; params.push(category_id); }
  sql += ' ORDER BY e.event_date ASC';
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET /api/events/:id
app.get('/api/events/:id', (req, res) => {
  db.query('SELECT e.*, c.name AS category_name FROM charity_events e LEFT JOIN categories c ON e.category_id = c.id WHERE e.id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || null);
  });
});

// GET /api/categories
app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM categories ORDER BY id', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
