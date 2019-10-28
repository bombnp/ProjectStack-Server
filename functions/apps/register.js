const express = require("express");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const helper = require("../utility/utilityfunctions.js");

let db = admin.firestore();

const app = express.Router();

function throwError(err, res)
{
    res.status(500).send(err.toString());
}

app.post("/register", async (req, res, next) => {
    let payload = req.body;

    // converts to lowercase
    payload.username = payload.username.toLowerCase();
    payload.email = payload.email.toLowerCase();

    var errors = [];

    var encryptPromise = bcrypt.hash(payload.password,10).then((encrypted) => {
        payload.encrypted = encrypted;
    });
    
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
        await encryptPromise;

        delete payload.confirmpassword;
        delete payload.password;
        
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

module.exports = app;

/*
    100 - username exists
    200 - email exists
    300 - password length < 8
    301 - password no upper
    302 - password no lower
    400 - password and confirm doesn't match
*/