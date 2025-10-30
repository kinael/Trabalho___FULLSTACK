const { db } = require('../db/db');

async function summary() {
  const sql = `
    SELECT r.type, r.resourceId, r.date, r.turno, r.userEmail, r.createdAt,
           u.name AS userName
    FROM reservations r
    LEFT JOIN users u ON u.email = r.userEmail
    ORDER BY r.date DESC, r.turno DESC, r.createdAt DESC
  `;
  return db.prepare(sql).all();
}

async function frequency() {
  const sql = `
    SELECT userEmail, COUNT(*) AS quantidade
    FROM reservations
    GROUP BY userEmail
    ORDER BY quantidade DESC
  `;
  return db.prepare(sql).all();
}

module.exports = { summary, frequency };
