const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const properties = require("./config/properties.js");
const cors = require("cors");
const PORT = properties.PORT;
const admin = require("firebase-admin")
const es6Renderer = require("express-es6-template-engine");

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
    
app.engine("html",es6Renderer);
app.set("views",path.join(__dirname, 'web'));
app.set("view engine", "html");

require("./router.js")(app);
console.log("Routed successfully!");

// error handler
app.use((err, req, res, next) => {
    console.error("ERROR: ", err);
    res.status(500).send("THERE IS ERROR AT: ", err);
})

app.listen(PORT, () => {
    console.log("Listening on: http://localhost:"+PORT);
})