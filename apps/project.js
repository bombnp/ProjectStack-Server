const express = require("express");
const admin = require("firebase-admin");
const helper = require("./utilityfunctions.js");

let db = admin.firestore();

const app = express.Router();

app.post("/project/join", helper.checkAuthen, (req, res, next) => {
    let payload = req.body;
    db.collection("projects").doc(payload.projectID).get()
    .then((docRef) => {
        docRef.get("requests").push(payload.username);
    })
})

app.post("/project/accept", helper.checkAuthen, (req, res, next) => {
})

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
        description: payload.description,
        ownerID: payload.ownerID,
        content: payload.content,
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

app.post("/project/info", (req, res, next) => {
    let payload = req.body;
    db.collection("projects").doc(payload.projectID).get()
    .then((snapshot) => {
        if(!snapshot.exists)
            next(new Error("Project ID not found."));
        else {
            if("fields" in payload){
                let data = {};
                payload.fields.forEach((field, index, arr) => {
                    data[field] = snapshot.get(field);
                    if(index == arr.length-1)
                        res.json(data);
                })
            }
            else {
                res.json(snapshot.data());
            }
        }
    })
})

app.post("/project/all", (req, res, next) => {
    let payload = req.body;
    let projectCards = [];
    db.collection("projects").orderBy("modifiedAt", "desc").get()
    .then(async (snapshot) => {
        for(var i=0; i<Math.min(snapshot.docs.length,payload.batch); i++) {
            let projectRef = snapshot.docs[i];
            await db.collection("users").doc(projectRef.get("ownerID")).get()
            .then((userRef) => {
                let data = {
                    projectID: projectRef.id,
                    projectName: projectRef.get("projectName"),
                    ownerID: userRef.id,
                    description: projectRef.get("description"),
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

app.post("/project/all/trending", (req, res, next) => {
    let payload = req.body;
    let projectCards = [];
    db.collection("projects").orderBy("modifiedAt", "asc").limit(5).get()
    .then((snapshot) => {
        for(var i=0; i<snapshot.docs.length; i++) {
            let projectRef = snapshot.docs[i];
            db.collection("users").doc(projectRef.get("ownerID")).get()
            .then((userRef) => {
                let data = {
                    projectID: projectRef.id,
                    projectName: projectRef.get("projectName"),
                    ownerID: userRef.id,
                }
                projectCards.push(data);
                if(projectCards.length == snapshot.docs.length)
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