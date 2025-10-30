const router = require('express').Router();
const { call } = require('../lib/http');

router.get('/summary', async (_req, res, next) => {
  try {
    const rows = await call('GET', '/reports/summary', null);     
    const freqRows = await call('GET', '/reports/frequency', null); 

    let mesas = 0, salas = 0;
    rows.forEach(r => { if (r.type === 'mesa') mesas++; else if (r.type === 'sala') salas++; });

    const freq = {};
    freqRows.forEach(r => { freq[r.userEmail] = Number(r.quantidade) || 0; });

    res.json({
      total: rows.length,
      mesas,
      salas,
      freq,
      reservations: rows
    });
  } catch (e) { next(e); }
});

module.exports = router;
