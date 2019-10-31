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

    let data = {
        name: payload.name,
        owner_id: payload.owner_id,
        content: payload.content,
        members: [payload.owner_id],
        requests: []
    }
    
    db.collection("projects").add(data)
    .then((docRef) => {
        res.json({ projectId: docRef.id });
    })
    .catch((err) => {
        next(err);
    })
})

function passVar(projectCards, projectRef, first_paragraph){
    return (userRef) => {
        let data = {
            name: projectRef.get("name"),
            owner_username: userRef.get("username"),
            content: first_paragraph.substring(0,Math.min(first_paragraph.length,200)),
            img: "https://denvercps.com/wp-content/uploads/2018/12/placeholder-square.png"
        }
        console.log("HEY2")
        projectCards.push(data);
        // console.log(projectCards);
    }
}

app.post("/project/all", async (req, res, next) => {
    let payload = req.body;
    let projectCards = [];
    let snapshots = []
    await db.collection("projects").limit(payload.batch).get()
    .then((snapshot) => {
        snapshots = snapshot.docs;
    })
    .catch((err) => {
        next(err);
    })
    snapshots.forEach((projectRef) => {
        first_paragraph = projectRef.get("content").paragraphs[0];
        db.collection("users").doc(projectRef.get("owner_id")).get()
        // .then(passVar(projectCards, projectRef, first_paragraph))
        .then((userRef) => {
            let data = {
                name: projectRef.get("name"),
                owner_username: userRef.get("username"),
                content: first_paragraph.substring(0,Math.min(first_paragraph.length,200)),
                img: "https://denvercps.com/wp-content/uploads/2018/12/placeholder-square.png"
            }
            projectCards.push(data);
            if(projectCards.length == snapshots.length)
                res.json(projectCards);
        })
        .catch((err) => {
            next(err);
        })
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