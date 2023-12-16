const express = require('express');
require("dotenv").config();
const app = express();


app.use(express.json());


//Route imports
const room = require('./routes/roomRoute');

app.get("/",(req,res) => {
    res.json("Hello")
})

app.use("/api/v1",room);

module.exports = app;