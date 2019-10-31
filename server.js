const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const properties = require("./config/properties.js");
const cors = require("cors");
const admin = require("firebase-admin")
const dotenv = require("dotenv");
const mustacheExpress = require("mustache-express");
const cookieParser = require("cookie-parser")
const path = require("path");

dotenv.config();

const serviceAccount = require("./privatekey/serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());

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

app.listen(properties.PORT, () => {
    console.log("Listening on: http://localhost:"+properties.PORT);
})