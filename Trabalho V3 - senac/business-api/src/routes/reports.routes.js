const r = require('express').Router();
const c = require('../controllers/reports.controller');

r.get('/summary', c.summary);      
r.get('/frequency', c.frequency);   

module.exports = r;
