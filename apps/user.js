const express = require("express");
const admin = require("firebase-admin");
const helper = require("./utilityfunctions.js");

let db = admin.firestore();

const app = express.Router();

app.post("/user/edit", helper.checkAuthen, (req, res, next) => {
    // current_Date = new Date();
    // let data = {
    //     username: payload.username,
    //     password : bcrypt.hashSync(payload.password,10),
    //     email: payload.email,
    //     title: payload.title ? payload.title : "",
    //     firstName: payload.firstName ? payload.firstName : "",
    //     lastName: payload.lastName ? payload.lastName : "",
    //     tel: payload.tel ? payload.tel : "",
    //     job: payload.job ? payload.job : "",
    //     workplace: payload.workplace ? payload.workplace : "",
    //     teams: [],
    //     createdAt: current_Date.getDate(),
    //     updatedAt: current_Date.getDate()
    // };
})

app.post("/user/all", (req, res, next) => {
    let payload = req.body;
    db.collection("users").select(...payload.fields).get().then((snapshot) => {
        res.json(snapshot.docs.map((docRef) => {
            let data = docRef.data();
            return data;
        }));
    }).catch((err) => {
        next(err);
    })
})

app.post("/user/info", (req, res, next) => {
    let payload = req.body;
    db.collection("users").doc(payload.username).get()
    .then((snapshot) => {
        if(!snapshot.exists)
            next(new Error("Username not found."));
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

module.exports = app;