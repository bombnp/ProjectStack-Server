const express = require("express");
const admin = require("firebase-admin");

let db = admin.firestore();

const app = express.Router();

app.post("/create", (req, res) => {
    let payload = req.body;
    let docRef = db.collection("users").doc(payload.email);
    docRef.set(payload).then(() => {
        res.status(201).send("User successfully created!");
    }).catch((err) => {
        res.status(400).send(err);
    })
})

app.get("/info", (req, res) => {
    db.collection("users").get().then((snapshot) => {
        snapshot.forEach((doc) => {
            console.log(doc.id);
        })
    }).catch((err) => {
        res.send(err);
    })
})

module.exports = app;