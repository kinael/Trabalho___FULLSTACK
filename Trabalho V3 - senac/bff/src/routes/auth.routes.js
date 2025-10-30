const router = require('express').Router();
const { call } = require('../lib/http');

router.post('/signup', async (req, res, next) => {
  try { res.json(await call('POST', '/auth/signup', req.body)); }
  catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try { res.json(await call('POST', '/auth/login', req.body)); }
  catch (e) { next(e); }
});

module.exports = router;
