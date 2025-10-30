const users = require('../repositories/users.repo');

function mk(status, msg){ const e=new Error(msg); e.status=status; return e; }

async function signup({ name, email, pass, role='func' }) {
  if (!name || !email || !pass) throw mk(400,'Campos obrigatórios: name, email, pass');
  if (users.findByEmail(email)) throw mk(409,'E-mail já cadastrado');
  const u = users.create({ name, email, pass, role });
  return { id: u.id, name: u.name, email: u.email, role: u.role };
}

async function login({ email, pass }) {
  if (!email || !pass) throw mk(400,'Informe email e senha');
  const u = users.findByEmail(email);
  if (!u || u.pass !== pass) throw mk(401,'Credenciais inválidas');
  return { id: u.id, name: u.name, email: u.email, role: u.role };
}

module.exports = { signup, login };
