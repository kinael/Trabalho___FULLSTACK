const resources = require('../repositories/resources.repo');
const reservations = require('../repositories/reservations.repo');

function mk(status, msg){ const e=new Error(msg); e.status=status; return e; }

async function create({ userEmail, type, resourceId, date, turno }) {
  if (!userEmail || !type || !resourceId || !date || !turno)
    throw mk(400,'Campos obrigatórios: userEmail, type, resourceId, date, turno');

  const r = resources.findById(resourceId);
  if (!r || r.type !== type) throw mk(404,'Recurso inválido');
  if (!r.enabled) throw mk(409,'Recurso desabilitado');
  if (reservations.exists(resourceId, date, turno)) throw mk(409,'Já reservado para este turno');

  return reservations.create({ userEmail, type, resourceId, date, turno });
}

async function listMy({ userEmail }) {
  if (!userEmail) throw mk(400,'userEmail obrigatório');
  return reservations.listByUser(userEmail);
}

async function remove({ id }) {
  if (!id) throw mk(400,'id obrigatório');
  reservations.remove(id);
  return { ok: true };
}

module.exports = { create, listMy, remove };
