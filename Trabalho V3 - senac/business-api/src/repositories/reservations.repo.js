const { db } = require('../db/db');
const { v4: uuid } = require('uuid');

function listByUser(email) {
  return db.prepare('SELECT * FROM reservations WHERE userEmail=? ORDER BY date DESC, turno DESC')
           .all(email);
}

function exists(resourceId, date, turno) {
  return db.prepare('SELECT 1 FROM reservations WHERE resourceId=? AND date=? AND turno=?')
           .get(resourceId, date, turno);
}

function create({ userEmail, type, resourceId, date, turno }) {
  const id = uuid();
  const createdAt = new Date().toISOString();
  db.prepare('INSERT INTO reservations (id,userEmail,type,resourceId,date,turno,createdAt) VALUES (?,?,?,?,?,?,?)')
    .run(id, userEmail, type, resourceId, date, turno, createdAt);
  return findById(id);
}

function findById(id) {
  return db.prepare('SELECT * FROM reservations WHERE id=?').get(id);
}

function remove(id) {
  db.prepare('DELETE FROM reservations WHERE id=?').run(id);
  return true;
}

function listTaken(resourceIds, date, turno) {
  if (!resourceIds.length) return [];
  const placeholders = resourceIds.map(() => '?').join(',');
  const sql = `SELECT resourceId FROM reservations WHERE resourceId IN (${placeholders}) AND date=? AND turno=?`;
  return db.prepare(sql).all(...resourceIds, date, turno).map(r => r.resourceId);
}

module.exports = { listByUser, exists, create, findById, remove, listTaken };
