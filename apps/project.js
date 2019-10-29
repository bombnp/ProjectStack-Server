const express = require("express");
const admin = require("firebase-admin");
const helper = require("./utilityfunctions.js");

let db = admin.firestore();

const app = express.Router();

app.post("/project/update", helper.checkAuthen, (req, res, next) => {
    let payload = req.body;

    let docId = payload.docId;

    let data = payload.data;
    delete data.docId;

    db.collection("projects").doc(docId).set(data)
    .then(() => {
        res.json({ success: true, projectId: docId });
    })
    .catch((err) => {
        next(err);
    })
})

app.post("/project/create", helper.checkAuthen, (req, res, next) => {
    let payload = req.body;

    let data = {
        name: payload.name,
        owner_id: payload.owner_id,
        content: payload.content,
        members: [payload.owner_id],
        requests: []
    }
    
    db.collection("projects").add(data)
    .then((docRef) => {
        res.json({ success: true, projectId: docRef.id});
    })
    .catch((err) => {
        next(err);
    })
})

module.exports = app;

/*
    name: string
    owner: uid(string)
    content: {
        title: array of string
        paragraph: array of paragraph
        img_url: array of img_url
    }
    member : array of uid
    request : array of uid

*/