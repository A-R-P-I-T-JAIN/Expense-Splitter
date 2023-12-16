const express = require('express');
const app = express();


app.use(express.json());


//Route imports
const room = require('./routes/roomRoute');


app.use("/api/v1",room);

module.exports = app;