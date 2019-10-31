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

    db.collection("projects").doc(docId).update(data)
    .then(() => {
        res.json({ projectId: docId });
    })
    .catch((err) => {
        next(err);
    })
})

app.post("/project/create", helper.checkAuthen, (req, res, next) => {
    let payload = req.body;

    let currentDate = new Date();

    let data = {
        projectName: payload.projectName,
        ownerID: payload.ownerID,
        content: payload.content,
        order: payload.order,
        members: [payload.ownerID],
        requests: [],
        createdAt: currentDate,
        modifiedAt: currentDate
    }
    
    db.collection("projects").add(data)
    .then((docRef) => {
        res.json({ projectId: docRef.id });
    })
    .catch((err) => {
        next(err);
    })
})

app.post("/project/all", async (req, res, next) => {
    let payload = req.body;
    let projectCards = [];
    // await db.collection("projects").limit(payload.batch).get()
    db.collection("projects").orderBy("modifiedAt", "desc").get()
    .then(async (snapshot) => {
        for(var i=0; i<Math.min(snapshot.docs.length,payload.batch); i++) {
            let projectRef = snapshot.docs[i];
            await db.collection("users").doc(projectRef.get("ownerID")).get()
            // .then(passVar(projectCards, projectRef, first_paragraph))
            .then((userRef) => {
                // console.log(projectRef.get("content").paragraphs);
                first_paragraph = (projectRef.get("content").paragraphs) ? projectRef.get("content").paragraphs[0] : "";
                let data = {
                    projectID: projectRef.id,
                    projectName: projectRef.get("projectName"),
                    ownerUsername: userRef.get("username"),
                    ownerID: userRef.id,
                    content: first_paragraph.substring(0,Math.min(first_paragraph.length,200)),
                    img_url: "https://denvercps.com/wp-content/uploads/2018/12/placeholder-square.png"
                }
                projectCards.push(data);
                if(projectCards.length == Math.min(snapshot.docs.length,payload.batch))
                    res.json(projectCards);
            })
            .catch((err) => {
                next(err);
            })
        }
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