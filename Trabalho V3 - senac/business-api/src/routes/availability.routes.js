const r = require('express').Router();
const c = require('../controllers/availability.controller');
r.get('/', c.check); 
module.exports = r;
