const svc = require('../services/auth.service');

module.exports = {
  signup: (req, res, next) => svc.signup(req.body).then(d => res.json(d)).catch(next),
  login : (req, res, next) => svc.login(req.body).then(d => res.json(d)).catch(next),
};
