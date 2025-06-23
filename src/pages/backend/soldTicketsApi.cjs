// Таблица для хранения количества проданных билетов по секциям
// section_id: string, sold: integer
const createSoldTicketsTable = `CREATE TABLE IF NOT EXISTS sold_tickets (
  section_id TEXT PRIMARY KEY,
  sold INTEGER DEFAULT 0
);`;
db.run(createSoldTicketsTable, (err) => {
  if (err) console.error('Error creating sold_tickets table', err);
});

// Получить все значения sold по секциям
app.get('/api/sold-tickets', (req, res) => {
  db.all('SELECT * FROM sold_tickets', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch sold tickets' });
    res.json(rows);
  });
});

// Обновить значения sold по секциям (bulk)
app.post('/api/sold-tickets', (req, res) => {
  const { sold } = req.body; // { parterre: 10, mezzanine: 5, ... }
  if (!sold || typeof sold !== 'object') return res.status(400).json({ error: 'Missing sold data' });
  const sectionIds = Object.keys(sold);
  const placeholders = sectionIds.map(() => '(?, ?)').join(',');
  const values = sectionIds.flatMap(id => [id, sold[id]]);
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
