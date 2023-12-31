const express = require('express');
require("dotenv").config();
const app = express();
const path = require('path');
const cors = require('cors');


app.use(express.json());
app.use(cors());


//Route imports
const room = require('./routes/roomRoute');

app.get("/",(req,res) => {
    res.json("Hello")
})

// app.use(express.static(path.join(__dirname, "../Client/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../Client/dist/index.html"));
// });

app.use("/api/v1",room);

module.exports = app;