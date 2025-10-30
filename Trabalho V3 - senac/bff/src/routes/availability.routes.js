const router = require('express').Router();
const { call } = require('../lib/http');

router.get('/', async (req, res) => {
  const q = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  try {
    const data = await call('GET', `/availability${q}`, null);
    res.json(Array.isArray(data?.disponiveis) ? data.disponiveis : []);
  } catch (e) {
    console.error('[BFF] /availability erro:', e);
    res.json([]); 
  }
});

module.exports = router;
