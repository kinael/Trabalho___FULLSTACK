const resources = require('../repositories/resources.repo');
const reservations = require('../repositories/reservations.repo');

function mk(status, msg){ const e=new Error(msg); e.status=status; return e; }

async function check({ type, date, turno }) {
  if (!['mesa','sala'].includes(type)) throw mk(400,'type deve ser mesa|sala');
  if (!date || !turno) throw mk(400,'date e turno são obrigatórios');

  const all = resources.list().filter(r => r.type === type && r.enabled);
  const taken = reservations.listTaken(all.map(r=>r.id), date, turno);
  const free = all.filter(r => !taken.includes(r.id));

  return {
    date, turno, type,
    total: all.length,
    livres: free.length,
    disponiveis: free
  };
}

module.exports = { check };
