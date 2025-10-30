const repo = require('../repositories/resources.repo');

function mk(status, msg){ const e=new Error(msg); e.status=status; return e; }

async function list() {
  const result = repo.list();
  return Array.isArray(result) ? result : [];
}

async function create({ type, name, enabled }) {
  if (!['mesa','sala'].includes(type)) throw mk(400, 'type deve ser mesa|sala');
  if (!name) throw mk(400, 'name obrigatório');
  const created = repo.create({ type, name, enabled: enabled ? 1 : 0 });
  return created;
}

async function toggle(id) {
  if (!id) throw mk(400, 'id obrigatório');
  const updated = repo.toggle(id);
  if (!updated) throw mk(404, 'Recurso não encontrado');
  return updated;
}

async function remove(id) {
  if (!id) throw mk(400, 'id obrigatório');
  repo.remove(id);
  return { ok: true };
}

module.exports = { list, create, toggle, remove };
