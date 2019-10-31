const express = require("express");
const admin = require("firebase-admin");

let db = admin.firestore();

const app = express.Router();

app.post("/team/create", (req, res, next) => {
    let payload = req.body;

    let data = {
        name: "",
        leader_id: payload.leader_id,
        members: []
    }
    db.collection("teams").add(data)
    .then((docRef) => {
        res.json({ teamID: docRef.id });
    })
    .catch((err) => {
        next(err);
    })
})

module.exports = app;