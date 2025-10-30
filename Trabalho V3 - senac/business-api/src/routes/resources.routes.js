const r = require('express').Router();
const c = require('../controllers/resources.controller');

r.get('/', c.list);
r.post('/', c.create);
r.patch('/:id/toggle', c.toggle);
r.delete('/:id', c.remove);

module.exports = r;
