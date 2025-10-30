const svc = require('../services/reservations.service');

module.exports = {
  create: (req, res, next) => svc.create(req.body).then(d => res.json(d)).catch(next),
  my    : (req, res, next) => svc.listMy(req.query).then(d => res.json(d)).catch(next),
  remove: (req, res, next) => svc.remove({ id: req.params.id }).then(d => res.json(d)).catch(next),
};
