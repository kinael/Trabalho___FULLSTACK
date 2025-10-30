const router = require('express').Router();
const { call } = require('../lib/http');

function groupResources(list) {
  const mesas = [];
  const salas = [];
  (Array.isArray(list) ? list : []).forEach(r => {
    const item = { id: r.id, name: r.name, active: !!r.enabled };
    if (r.type === 'mesa') mesas.push(item);
    if (r.type === 'sala') salas.push(item);
  });
  return { mesas, salas };
}

router.get('/', async (_req, res) => {
  try {
    const data = await call('GET', '/resources', null);
    res.json(groupResources(data));
  } catch (e) {
    console.error('[BFF] /resources erro:', e);
    res.json({ mesas: [], salas: [] });
  }
});

router.post('/mesas', async (req, res, next) => {
  try {
    const name = (req.body && req.body.name || '').trim();
    if (!name) return res.status(400).json({ message: 'name é obrigatório' });
    const created = await call('POST', '/resources', { type: 'mesa', name, enabled: 1 });
    res.json(created);
  } catch (e) { next(e); }
});

router.post('/salas', async (req, res, next) => {
  try {
    const name = (req.body && req.body.name || '').trim();
    if (!name) return res.status(400).json({ message: 'name é obrigatório' });
    const created = await call('POST', '/resources', { type: 'sala', name, enabled: 1 });
    res.json(created);
  } catch (e) { next(e); }
});

router.patch('/mesa/:id/toggle', async (req, res, next) => {
  try { res.json(await call('PATCH', `/resources/${req.params.id}/toggle`, null)); }
  catch (e) { next(e); }
});

router.patch('/sala/:id/toggle', async (req, res, next) => {
  try { res.json(await call('PATCH', `/resources/${req.params.id}/toggle`, null)); }
  catch (e) { next(e); }
});

router.delete('/mesa/:id', async (req, res, next) => {
  try { res.json(await call('DELETE', `/resources/${req.params.id}`, null)); }
  catch (e) { next(e); }
});

router.delete('/sala/:id', async (req, res, next) => {
  try { res.json(await call('DELETE', `/resources/${req.params.id}`, null)); }
  catch (e) { next(e); }
});

module.exports = router;
