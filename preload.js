//sab 4 jul 2020 1:13
const express = require('express');
const routes = require('./routers');
const cors = require('cors');
const app=express();
const DEFAULT_PORT = 8176;

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(DEFAULT_PORT);

