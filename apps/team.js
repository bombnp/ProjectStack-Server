const express = require("express");
const admin = require("firebase-admin");

let db = admin.firestore();

const app = express.Router();

app.post("/team/create", (req, res, next) => {
    let payload = req.body;

    let currentDate = new Date();

    let data = {
        name: teamName,
        leaderID: payload.leaderID,
        members: payload.members,
        createdAt: currentDate,
        modifiedAt: currentDate
    }
    db.collection("teams").add(data)
    .then((docRef) => {
        res.json({ teamID: docRef.id });
    })
    .catch((err) => {
        next(err);
    })
})

app.post("/team/edit", (req, res, next) => {
    let payload = req.body;

    let currentDate = new Date();

    let data = {
        name: teamName,
        leaderID: payload.leaderID,
        members: payload.members,
        modifiedAt: currentDate
    }
    await db.collection("teams").doc(payload.teamID).set(data, { merge : true })
    res.json({ teamID: payload.teamID });
})

module.exports = app;