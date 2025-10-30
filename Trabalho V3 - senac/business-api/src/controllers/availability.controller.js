const svc = require('../services/availability.service');

module.exports = {
  check: (req, res, next) => svc.check(req.query).then(d => res.json(d)).catch(next),
};
