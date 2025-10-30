const r = require('express').Router();
const c = require('../controllers/reservations.controller');
r.get('/my', c.my);         
r.post('/', c.create);
r.delete('/:id', c.remove);
module.exports = r;
