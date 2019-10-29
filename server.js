const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const properties = require("./config/properties.js");
const cors = require("cors");
const PORT = properties.PORT;
const admin = require("firebase-admin")

const serviceAccountKey = require("./privatekey/serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use("/",require("./router.js"));
console.log("Routed successfully!");

app.get("/", (req, res) => {
    res.send("Welcome to ProjectStack-Server API!");
})

// error handler
app.use((err, req, res, next) => {
    console.error("ERROR: ", err);
    res.status(500).send("ERROR: ", err);
})

app.listen(PORT, () => {
    console.log("Server successfully initialized");
})