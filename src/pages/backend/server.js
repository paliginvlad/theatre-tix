// Используем CommonJS синтаксис для Node.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database('./src/pages/backend/theatre-tix.db', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create users table if not exists
const createTable = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user'
);`;
db.run(createTable, (err) => {
  if (err) console.error('Error creating users table', err);
});

// Ensure default admin exists
const ensureAdmin = () => {
  db.get('SELECT * FROM users WHERE username = ?', ['admin'], async (err, row) => {
    if (!row) {
      const hash = await bcrypt.hash('admin', 10);
      db.run('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', ['admin', hash, 'admin']);
      console.log('Default admin created');
    }
  });
};
ensureAdmin();

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  const hash = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', [username, hash, 'user'], function(err) {
    if (err) return res.status(400).json({ error: 'User already exists' });
    res.json({ success: true });
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ success: true, role: user.role });
  });
});

// Change admin password endpoint
app.post('/api/admin/change-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', ['admin'], async (err, user) => {
    if (!user) return res.status(404).json({ error: 'Admin not found' });
    const match = await bcrypt.compare(oldPassword, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid old password' });
    const newHash = await bcrypt.hash(newPassword, 10);
    db.run('UPDATE users SET password_hash = ? WHERE username = ?', [newHash, 'admin'], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to update password' });
      res.json({ success: true });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
