// Таблица для хранения последней рассчитанной прибыли по секциям и общей суммы
// section_id: string, profit: number, total: number
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

// Получить последнюю рассчитанную прибыль по секциям и общую сумму
app.get('/api/last-profit', (req, res) => {
  db.all('SELECT * FROM last_profit', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch last profit' });
    db.get('SELECT total FROM last_total_profit WHERE id = 1', (err2, totalRow) => {
      if (err2) return res.status(500).json({ error: 'Failed to fetch last total profit' });
      res.json({ profits: rows, total: totalRow ? totalRow.total : 0 });
    });
  });
});

// Сохранить последнюю рассчитанную прибыль по секциям и общую сумму
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
