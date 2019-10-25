const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express.Router();

app.get("/", (req, res) => {
    res.send("SIGN UP PAGE");
})

module.exports = app;