// Используем CommonJS синтаксис для Node.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

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
  role TEXT NOT NULL DEFAULT 'user',
  firstName TEXT,
  lastName TEXT,
  email TEXT
);`;
db.run(createTable, (err) => {
  if (err) console.error('Error creating users table', err);
});

// Employees table
const createEmployeesTable = `CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  hourlyRate REAL NOT NULL
);`;
db.run(createEmployeesTable, (err) => {
  if (err) console.error('Error creating employees table', err);
});

// Ticket sections table
const createTicketSectionsTable = `CREATE TABLE IF NOT EXISTS ticket_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section_id TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ua TEXT NOT NULL,
  price REAL
);`;
db.run(createTicketSectionsTable, (err) => {
  if (err) console.error('Error creating ticket_sections table', err);
});

// News table
const createNewsTable = `CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title_ua TEXT NOT NULL,
  title_en TEXT NOT NULL,
  summary_ua TEXT,
  summary_en TEXT,
  content_ua TEXT NOT NULL,
  content_en TEXT NOT NULL,
  date TEXT NOT NULL,
  image TEXT
);`;
db.run(createNewsTable, (err) => {
  if (err) console.error('Error creating news table', err);
});

// Sold tickets table
const createSoldTicketsTable = `CREATE TABLE IF NOT EXISTS sold_tickets (
  section_id TEXT PRIMARY KEY,
  sold INTEGER DEFAULT 0
);`;
db.run(createSoldTicketsTable, (err) => {
  if (err) console.error('Error creating sold_tickets table', err);
});

// --- LAST PROFIT API ---
const createProfitTable = `CREATE TABLE IF NOT EXISTS last_profit (
  section_id TEXT PRIMARY KEY,
  profit INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS last_total_profit (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  total INTEGER DEFAULT 0
);
`;
db.exec(createProfitTable, (err) => {
  if (err) console.error('Error creating last_profit/last_total_profit tables', err);
});

// Comments table
const createCommentsTable = `CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  performance_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER NOT NULL,
  date TEXT NOT NULL
);`;
db.run(createCommentsTable, (err) => {
  if (err) console.error('Error creating comments table', err);
});


// Ensure default admin exists
const ensureAdmin = () => {
  db.get('SELECT * FROM users WHERE username = ?', ['admin'], async (err, row) => {
    if (!row) {
      const hash = await bcrypt.hash('admin', 10);
      db.run(
        'INSERT INTO users (username, password_hash, role, firstName, lastName, email) VALUES (?, ?, ?, ?, ?, ?)',
        ['admin', hash, 'admin', 'Admin', 'User', 'admin@theatretix.com']
      );
      console.log('Default admin created');
    }
  });
};
ensureAdmin();

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, password, firstName, lastName, email } = req.body;
  if (!username || !password || !firstName || !lastName || !email) return res.status(400).json({ error: 'Missing fields' });
  const hash = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users (username, password_hash, role, firstName, lastName, email) VALUES (?, ?, ?, ?, ?, ?)', [username, hash, 'user', firstName, lastName, email], function(err) {
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
    res.json({
      success: true,
      role: user.role,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || ''
    });
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

// Endpoint to update user profile
app.post('/api/update-profile', async (req, res) => {
  const { username, firstName, lastName, email } = req.body;
  if (!username) return res.status(400).json({ error: 'Missing username' });
  db.run(
    'UPDATE users SET firstName = ?, lastName = ?, email = ? WHERE username = ?',
    [firstName, lastName, email, username],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to update profile' });
      res.json({ success: true });
    }
  );
});

// Update username
app.post('/api/update-username', (req, res) => {
  const { oldUsername, newUsername } = req.body;
  if (!oldUsername || !newUsername) return res.status(400).json({ error: 'Missing fields' });
  db.run('UPDATE users SET username = ? WHERE username = ?', [newUsername, oldUsername], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to update username' });
    res.json({ success: true });
  });
});

// Update user password
app.post('/api/update-password', async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  if (!username || !oldPassword || !newPassword) return res.status(400).json({ error: 'Missing fields' });
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (!user) return res.status(404).json({ error: 'User not found' });
    const match = await bcrypt.compare(oldPassword, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid old password' });
    const newHash = await bcrypt.hash(newPassword, 10);
    db.run('UPDATE users SET password_hash = ? WHERE username = ?', [newHash, username], function(err) {
      if (err) return res.status(500).json({ error: 'Failed to update password' });
      res.json({ success: true });
    });
  });
});

// Delete user profile
app.post('/api/delete-profile', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Missing username' });
  db.run('DELETE FROM users WHERE username = ?', [username], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to delete profile' });
    res.json({ success: true });
  });
});

// --- EMPLOYEES API ---
// Get all employees
app.get('/api/employees', (req, res) => {
  db.all('SELECT * FROM employees', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch employees' });
    res.json(rows);
  });
});

// Add employee
app.post('/api/employees', (req, res) => {
  const { name, position, hourlyRate } = req.body;
  if (!name || !position || hourlyRate == null) return res.status(400).json({ error: 'Missing fields' });
  db.run('INSERT INTO employees (name, position, hourlyRate) VALUES (?, ?, ?)', [name, position, hourlyRate], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to add employee' });
    res.json({ id: this.lastID, name, position, hourlyRate });
  });
});

// Update employee
app.put('/api/employees/:id', (req, res) => {
  const { name, position, hourlyRate } = req.body;
  const { id } = req.params;
  db.run('UPDATE employees SET name = ?, position = ?, hourlyRate = ? WHERE id = ?', [name, position, hourlyRate, id], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to update employee' });
    res.json({ success: true });
  });
});

// Delete employee
app.delete('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM employees WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to delete employee' });
    res.json({ success: true });
  });
});

// --- TICKET SECTIONS API ---
// Get all ticket sections and prices
app.get('/api/ticket-sections', (req, res) => {
  db.all('SELECT * FROM ticket_sections', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch ticket sections' });
    res.json(rows);
  });
});

// Add or update ticket section price
app.post('/api/ticket-sections', (req, res) => {
  const { section_id, name_en, name_ua, price } = req.body;
  if (!section_id || !name_en || !name_ua) return res.status(400).json({ error: 'Missing fields' });
  db.run(
    'INSERT INTO ticket_sections (section_id, name_en, name_ua, price) VALUES (?, ?, ?, ?) ON CONFLICT(section_id) DO UPDATE SET price = excluded.price',
    [section_id, name_en, name_ua, price],
    function(err) {
      if (err) return res.status(500).json({ error: 'Failed to add/update ticket section' });
      res.json({ success: true });
    }
  );
});

// Update only price for a section
app.put('/api/ticket-sections/:section_id', (req, res) => {
  const { price } = req.body;
  const { section_id } = req.params;
  db.run('UPDATE ticket_sections SET price = ? WHERE section_id = ?', [price, section_id], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to update ticket section price' });
    res.json({ success: true });
  });
});

// --- NEWS API ---
// Получить все новости
app.get('/api/news', (req, res) => {
  db.all('SELECT * FROM news ORDER BY date DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch news' });
    res.json(rows);
  });
});

// Добавить новость
app.post('/api/news', (req, res) => {
  const { title_ua, title_en, summary_ua, summary_en, content_ua, content_en, date, image } = req.body;
  if (!title_ua || !title_en || !content_ua || !content_en || !date) return res.status(400).json({ error: 'Missing fields' });
  db.run(
    'INSERT INTO news (title_ua, title_en, summary_ua, summary_en, content_ua, content_en, date, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [title_ua, title_en, summary_ua, summary_en, content_ua, content_en, date, image],
    function(err) {
      if (err) return res.status(500).json({ error: 'Failed to add news' });
      res.json({ id: this.lastID });
    }
  );
});

// Обновить новость
app.put('/api/news/:id', (req, res) => {
  const { id } = req.params;
  const { title_ua, title_en, summary_ua, summary_en, content_ua, content_en, date, image } = req.body;
  db.run(
    'UPDATE news SET title_ua=?, title_en=?, summary_ua=?, summary_en=?, content_ua=?, content_en=?, date=?, image=? WHERE id=?',
    [title_ua, title_en, summary_ua, summary_en, content_ua, content_en, date, image, id],
    function(err) {
      if (err) return res.status(500).json({ error: 'Failed to update news' });
      res.json({ success: true });
    }
  );
});

// Удалить новость
app.delete('/api/news/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM news WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to delete news' });
    res.json({ success: true });
  });
});

// --- SOLD TICKETS API ---
app.get('/api/sold-tickets', (req, res) => {
  db.all('SELECT * FROM sold_tickets', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch sold tickets' });
    res.json(rows);
  });
});

app.post('/api/sold-tickets', (req, res) => {
  const { sold } = req.body; // { parterre: 10, mezzanine: 5, ... }
  if (!sold || typeof sold !== 'object') return res.status(400).json({ error: 'Missing sold data' });
  const sectionIds = Object.keys(sold);
  db.serialize(() => {
    sectionIds.forEach(id => {
      db.run(
        'INSERT INTO sold_tickets (section_id, sold) VALUES (?, ?) ON CONFLICT(section_id) DO UPDATE SET sold = excluded.sold',
        [id, sold[id]]
      );
    });
    res.json({ success: true });
  });
});

// --- LAST PROFIT API ---
app.get('/api/last-profit', (req, res) => {
  db.all('SELECT * FROM last_profit', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch last profit' });
    db.get('SELECT total FROM last_total_profit WHERE id = 1', (err2, totalRow) => {
      if (err2) return res.status(500).json({ error: 'Failed to fetch last total profit' });
      res.json({ profits: rows, total: totalRow ? totalRow.total : 0 });
    });
  });
});

app.post('/api/last-profit', (req, res) => {
  const { profits, total } = req.body; // profits: { parterre: 100, ... }, total: number
  if (!profits || typeof profits !== 'object' || typeof total !== 'number') return res.status(400).json({ error: 'Missing data' });
  const sectionIds = Object.keys(profits);
  db.serialize(() => {
    sectionIds.forEach(id => {
      db.run(
        'INSERT INTO last_profit (section_id, profit) VALUES (?, ?) ON CONFLICT(section_id) DO UPDATE SET profit = excluded.profit',
        [id, profits[id]]
      );
    });
    db.run(
      'INSERT INTO last_total_profit (id, total) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET total = excluded.total',
      [total]
    );
    res.json({ success: true });
  });
});

// --- COMMENTS API ---
// Получить все комментарии для спектакля
app.get('/api/comments/:performanceId', (req, res) => {
  const { performanceId } = req.params;
  db.all('SELECT * FROM comments WHERE performance_id = ? ORDER BY date DESC', [performanceId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch comments' });
    res.json(rows);
  });
});

// Добавить комментарий
app.post('/api/comments', (req, res) => {
  const { performance_id, user_id, user_name, text, rating, date } = req.body;
  if (!performance_id || !user_id || !user_name || !text || !rating || !date) return res.status(400).json({ error: 'Missing fields' });
  db.run(
    'INSERT INTO comments (performance_id, user_id, user_name, text, rating, date) VALUES (?, ?, ?, ?, ?, ?)',
    [performance_id, user_id, user_name, text, rating, date],
    function(err) {
      if (err) return res.status(500).json({ error: 'Failed to add comment' });
      res.json({ id: this.lastID });
    }
  );
});

// Редактировать комментарий
app.put('/api/comments/:id', (req, res) => {
  const { id } = req.params;
  const { text, rating } = req.body;
  if (!text || !rating) return res.status(400).json({ error: 'Missing fields' });
  db.run('UPDATE comments SET text = ?, rating = ? WHERE id = ?', [text, rating, id], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to update comment' });
    res.json({ success: true });
  });
});

// Удалить комментарий
app.delete('/api/comments/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM comments WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to delete comment' });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
