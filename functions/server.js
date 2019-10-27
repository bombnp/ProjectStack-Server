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

properties.app_names.forEach((val, index, array) => {
    app.use("/"+val,require("./apps/"+val));
    console.log("Routed to /"+val);
})
console.log("Routed successfully!");

module.exports = app;

/*
login - req: username, password res: status(success, not found, invalid)
register - req: schema process: (check for matching username, email, password-confirmpassword match) (password strength) res: one response for each statuses
*/