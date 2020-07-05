const express = require('express');
const NanoJS = require('./nanojs');

const routes = express.Router();

routes.get('/', NanoJS.commands);

module.exports = routes;

