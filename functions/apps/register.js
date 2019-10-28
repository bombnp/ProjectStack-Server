const express = require("express");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const helper = require("../utility/utilityfunctions.js");

let db = admin.firestore();

const app = express.Router();

app.post("/register", async (req, res, next) => {
    let payload = req.body;

    // converts to lowercase
    payload.username = payload.username.toLowerCase();
    payload.email = payload.email.toLowerCase();

    var errors = [];
    
    await Promise.all([
        db.collection("users").where("username","==",payload.username).get(),
        db.collection("users").doc(payload.email).get()
    ])
    .then(([usernameSnapshot, emailSnapshot]) => {
        
        if(!usernameSnapshot.empty)
            errors.push(100);
        if(emailSnapshot.exists)
            errors.push(200);
    })
    .catch((err) => {
        next(err);
    })

    if(payload.password.length < 8)
        errors.push(300);
    if(payload.password.toLowerCase() == payload.password)
        errors.push(301);
    if(payload.password.toUpperCase() == payload.password)
        errors.push(302);

    if(payload.password != payload.confirmpassword)
        errors.push(400);

    if(errors.length > 0)
        res.json({ success: false, val: errors });
    else
    {
        payload.password = bcrypt.hashSync(payload.password,10);

        delete payload.confirmpassword;
        
        await db.collection("users").doc(payload.email).set(payload).catch((err) => {
            next(err);
        });
        
        let token = helper.generateAuthToken({_id: payload.email, username: payload.username});

        res.header("token", token).json({ success: true, val: {
            _id: payload.email,
            username: payload.username
        }});
    }
})

app.post("/login", async (req, res, next) => {
    let payload = req.body;

    payload.loginname = payload.loginname.toLowerCase();

    if(payload.loginname.includes("@")){ // login with email
        console.log("EMAIL!");
        db.collection("users").doc(payload.loginname).get()
        .then((snapshot) => {
            if(snapshot.exists)
            {
                if(bcrypt.compareSync(payload.password, snapshot.get("password")))
                    res.json(100) // success
                else
                    res.json(200) // password mismatch
            }
            else
                res.json(300) // loginname not found
        })
        .catch((err) => {
            next(err);
        })
    }
    else { // login with username
        console.log("USERNAME!")
        console.log(payload.loginname);
        db.collection("users").where("username", "==", payload.loginname).get()
        .then((snapshot) => {
            if(!snapshot.empty)
            {
                snapshot.docs.forEach((docSnapshot) => {
                    console.log(payload.password);
                    console.log(docSnapshot.data());
                    if(bcrypt.compareSync(payload.password, docSnapshot.get("password")))
                        res.json(100)
                    else
                        res.json(200)
                })
            }
            else
                res.json(300)
        })
        .catch((err) => {
            next(err);
        })
    }
})
module.exports = app;

/*
    100 - username exists
    200 - email exists
    300 - password length < 8
    301 - password no upper
    302 - password no lower
    400 - password and confirm doesn't match
*/ 