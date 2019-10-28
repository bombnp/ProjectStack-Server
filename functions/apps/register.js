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
            errors.push(401);
        if(emailSnapshot.exists)
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
        
        db.collection("users").doc(payload.loginname).get()
        .then((snapshot) => {
            if(snapshot.exists)
            {
                if(bcrypt.compareSync(payload.password, snapshot.get("password")))
                {
                    let token = helper.generateAuthToken({});
                    res.header("token", token).json(200) // success
                }
                else
                    res.json(401) // password mismatch
            }
            else
                res.json(402) // loginname not found
        })
        .catch((err) => {
            next(err);
        })
    }
    else { // login with username

        db.collection("users").where("username", "==", payload.loginname).get()
        .then((snapshot) => {
            if(!snapshot.empty)
            {
                snapshot.docs.forEach((docSnapshot) => {
                    if(bcrypt.compareSync(payload.password, docSnapshot.get("password")))
                    {
                        let token = helper.generateAuthToken({});
                        res.header("token", token).json(200) // success
                    }
                    else
                        res.json(401)
                })
            }
            else
                res.json(402)
        })
        .catch((err) => {
            next(err);
        })
    }
})
module.exports = app;