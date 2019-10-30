const express = require("express");
const admin = require("firebase-admin");

let db = admin.firestore();

const app = express.Router();

app.post("/user/create", (req, res, next) => {
    let payload = req.body;
    db.collection("users").doc(payload.email);
    docRef.set(payload).then(() => {
        res.status(201).send("User successfully created!");
    }).catch((err) => {
        next(err);
    })
    res.render()
})

app.get("/user/info", (req, res, next) => {
    db.collection("users").get().then((snapshot) => {
        snapshot.forEach((doc) => {
            console.log(doc.id);
        })
    }).catch((err) => {
        next(err);
    })
})

module.exports = app;