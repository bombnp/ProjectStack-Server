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
    db.collection("users").select("username", "email").get().then((snapshot) => {
        res.json(snapshot.docs.map((docRef) => {
            let data = docRef.data();
            data.userID = docRef.id;
            return data;
        }));
    }).catch((err) => {
        next(err);
    })
})

module.exports = app;