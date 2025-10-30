const svc = require('../services/reports.service');

module.exports = {
  summary  : (_req, res, next) => svc.summary().then(d => res.json(d)).catch(next),
  frequency: (_req, res, next) => svc.frequency().then(d => res.json(d)).catch(next),
};
