const express = require("express");
const admin = require("firebase-admin");
const bcrypt = require("bcrypt");
const helper = require("./utilityfunctions.js");
const defaultPicURL = require("../config/properties.js").defaultProfilePic;

let db = admin.firestore();

const app = express.Router();

function authenticate(docRef, res){
    let token = helper.generateAuthToken({ username: docRef.id, profilepic_url: docRef.get("profilepic_url")});

    res
    .cookie("token", token)
    .cookie("username", docRef.id)
    .cookie("profilepic_url", docRef.get("profilepic_url"))
    .json({ success: true });
}

function unauthenticate(res){
    res
    .clearCookie("token")
    .clearCookie("username")
    .clearCookie("profilepic_url")
    .json({ success: true });
}

app.post("/register", async (req, res, next) => {
    let payload = req.body;

    // converts to lowercase
    if(!payload.username || !payload.password || !payload.email || !payload.confirmpassword)
        next(new Error("Not enough registration information"));
    payload.username = payload.username.toLowerCase();
    payload.email = payload.email.toLowerCase();

    var errors = [];
    await Promise.all([
        db.collection("users").where("username","==",payload.username).get(),
        db.collection("users").where("email","==",payload.email).get()
    ])
    .then(([usernameSnapshot, emailSnapshot]) => {
        if(!usernameSnapshot.empty)
            errors.push(401);
        if(!emailSnapshot.empty)
            errors.push(402);
    })
    .catch((err) => {
        next(err);
    })

    if(payload.password.length < 8)
        errors.push(403);
    if(payload.password.toLowerCase() == payload.password)
        errors.push(404);
    if(payload.password.toUpperCase() == payload.password)
        errors.push(405);

    if(payload.password != payload.confirmpassword)
        errors.push(406);

    if(errors.length > 0)
        res.json({ success: false, val: errors });
    else
    {
        let currentDate = new Date();
        let data = {
            username: payload.username,
            password : bcrypt.hashSync(payload.password,10),
            email: payload.email,
            title: payload.title ? payload.title : "",
            firstName: payload.firstName ? payload.firstName : "",
            lastName: payload.lastName ? payload.lastName : "",
            tel: payload.tel ? payload.tel : "",
            job: payload.job ? payload.job : "",
            workplace: payload.workplace ? payload.workplace : "",
            projects: [],
            teams: [],
            profilepic_url: defaultPicURL,
            createdAt: currentDate,
            modifiedAt: currentDate
        };
        
        await db.collection("users").doc(data.username).set(data)
        .then(() => {})
        .catch((err) => {
            next(err);
        });

        db.collection("users").doc(data.username).get()
        .then((docRef) => {
            authenticate(docRef, res);
        })
        .catch((err) => {
            next(err);
        })
    }
})

app.post("/login", (req, res, next) => {
    let payload = req.body;

    payload.loginname = payload.loginname.toLowerCase();

    if(!payload.loginname.includes("@")){ // login with username
        
        db.collection("users").doc(payload.loginname).get()
        .then((docRef) => {
            if(docRef.exists)
            {
                if(bcrypt.compareSync(payload.password, docRef.get("password")))
                    authenticate(docRef, res); // success
                else
                    res.json({ success: false, val: [401]}); // password mismatch
            }
            else
            res.json({ success: false, val: [402]}); // loginname not found
        })
        .catch((err) => {
            next(err);
        })
    }
    else { // login with email

        db.collection("users").where("email", "==", payload.loginname).get()
        .then((querySnapshot) => {
            if(!querySnapshot.empty)
            {
                querySnapshot.docs.forEach((docRef) => {
                    if(bcrypt.compareSync(payload.password, docRef.get("password")))
                        authenticate(docRef, res); // success
                    else
                        res.json({ success: false, val: [401]}); // password mismatch
                })
            }
            else
            res.json({ success: false, val: [402]}); // loginname not found
        })
        .catch((err) => {
            next(err);
        })
    }
})

app.post("/logout", (req, res) => {
    unauthenticate(res);
})

app.post("/checkauthen", helper.checkAuthen, (req, res) => {
    res.json(req.user);
})

module.exports = app;