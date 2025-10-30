const router = require('express').Router();
const { call } = require('../lib/http');

router.get('/my', async (req, res, next) => {
  try {
    const q = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    res.json(await call('GET', `/reservations/my${q}`, null));
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try { res.json(await call('POST', '/reservations', req.body)); }
  catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try { res.json(await call('DELETE', `/reservations/${req.params.id}`, null)); }
  catch (e) { next(e); }
});

module.exports = router;
