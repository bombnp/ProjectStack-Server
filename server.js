const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const properties = require("./config/properties.js");
const cors = require("cors");
const PORT = properties.PORT;
const admin = require("firebase-admin")
const mustacheExpress = require("mustache-express");

const serviceAccountKey = require("./privatekey/serviceAccountKey.json");
const path = require("path");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("web"));
    
app.engine("html",mustacheExpress());
app.set("views",path.join(__dirname, 'web'));
app.set("view engine", "html");

require("./router.js")(app);
console.log("Routed successfully!");

// error handler
app.use((err, req, res, next) => {
    console.error("ERROR: ", err);
    res.status(500).send("ERROR THROWBACK   : "+ err);
})

app.listen(PORT, () => {
    console.log("Listening on: http://localhost:"+PORT);
})