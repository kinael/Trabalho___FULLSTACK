const { db } = require('../db/db');
const { v4: uuid } = require('uuid');

function findByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}
function create({ name, email, pass, role }) {
  const id = uuid();
  db.prepare('INSERT INTO users (id,name,email,pass,role) VALUES (?,?,?,?,?)')
    .run(id, name, email, pass, role);
  return { id, name, email, pass, role };
}

module.exports = { findByEmail, create };
