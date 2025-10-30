const svc = require('../services/resources.service');

module.exports = {
  list: async (_req, res, next) => {
    try {
      const data = await svc.list();
      res.json(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('[resources.controller] erro list:', e);
      res.json([]); 
    }
  },
  create: (req, res, next) =>
    svc.create(req.body).then(d => res.json(d)).catch(next),

  toggle: (req, res, next) =>
    svc.toggle(req.params.id).then(d => res.json(d)).catch(next),

  remove: (req, res, next) =>
    svc.remove(req.params.id).then(d => res.json(d)).catch(next),
};
