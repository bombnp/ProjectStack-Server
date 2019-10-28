const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const properties = require("./config/properties.js");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use("/",require("./router.js"));
console.log("Routed successfully!");

// error handler
app.use((err, req, res, next) => {
    console.error("ERROR: ", err);
    res.status(500).send("ERROR: ", err);
})

module.exports = app;