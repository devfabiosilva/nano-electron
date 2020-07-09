const express = require('express');
const NanoJS = require('./nanojs');

const routes = express.Router();

routes.post('/data', NanoJS.commands);

routes.all('/*', function(req, res) {
   res.json({error: -1, reason: "Unknown method"});
});

module.exports = routes;

