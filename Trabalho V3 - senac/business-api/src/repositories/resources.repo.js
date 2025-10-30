const { db } = require('../db/db');
const { v4: uuid } = require('uuid');

function list() {
  return db.prepare('SELECT * FROM resources ORDER BY type, name').all();
}

function findById(id) {
  return db.prepare('SELECT * FROM resources WHERE id=?').get(id);
}

function create({ type, name, enabled = 1 }) {
  const id = uuid();
  db.prepare('INSERT INTO resources (id,type,name,enabled) VALUES (?,?,?,?)')
    .run(id, type, name, enabled ? 1 : 0);
  return findById(id);
}

function toggle(id) {
  const r = findById(id);
  if (!r) return null;
  const newVal = r.enabled ? 0 : 1;
  db.prepare('UPDATE resources SET enabled=? WHERE id=?').run(newVal, id);
  return findById(id);
}

function remove(id) {
  db.prepare('DELETE FROM resources WHERE id=?').run(id);
  return true;
}

module.exports = { list, findById, create, toggle, remove };
