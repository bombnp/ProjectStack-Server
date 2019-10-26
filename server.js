const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const properties = require("./config/properties.js");
const PORT = properties.PORT;
const db = require("./config/database.js");

db();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

properties.app_names.forEach((val, index, array) => {
    app.use("/"+val,require("./apps/"+val));
    console.log("Routed to /"+val);
})

app.get("/",(req, res) =>{
    res.json("Welcome");
})

app.listen(PORT, () => {
    console.log("  App is running at http://localhost:"+PORT);
    console.log("  Press CTRL-C to stop\n");
})

module.exports = app;