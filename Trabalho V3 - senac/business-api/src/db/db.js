const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuid } = require('uuid');

const dbPath = path.join(__dirname, '..', '..', 'database.db');
const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  pass TEXT NOT NULL,
  role TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('mesa','sala')),
  name TEXT NOT NULL
  -- colunas adicionais (ex: active / enabled) virão via migração
);

CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY,
  userEmail TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('mesa','sala')),
  resourceId TEXT NOT NULL,
  date TEXT NOT NULL,     -- YYYY-MM-DD
  turno TEXT NOT NULL,    -- MANHA|TARDE|NOITE
  createdAt TEXT NOT NULL,
  UNIQUE(resourceId, date, turno)
);
`);

function columnExists(table, col) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all();
  return cols.some(c => c.name === col);
}

const hasEnabled = columnExists('resources', 'enabled');
if (!hasEnabled) {
  const hasActive = columnExists('resources', 'active');

  db.exec(`ALTER TABLE resources ADD COLUMN enabled INTEGER`);

  if (hasActive) {
    db.exec(`UPDATE resources SET enabled = COALESCE(active, 1)`);
  } else {
    db.exec(`UPDATE resources SET enabled = 1`);
  }
}


const hasUser = db.prepare('SELECT 1 FROM users LIMIT 1').get();
if (!hasUser) {
  db.prepare('INSERT INTO users (id,name,email,pass,role) VALUES (?,?,?,?,?)')
    .run(uuid(), 'Admin', 'admin@local', '123', 'adm');

  const hasRes = db.prepare('SELECT 1 FROM resources LIMIT 1').get();
  if (!hasRes) {
    const ins = db.prepare('INSERT INTO resources (id,type,name,enabled) VALUES (?,?,?,?)');
    ['mesa','mesa','mesa','sala','sala','sala'].forEach((t, i) => {
      ins.run(uuid(), t, `${t.toUpperCase()} ${i+1}`, 0); 
    });
  }
}

module.exports = { db };
