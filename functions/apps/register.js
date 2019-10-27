const express = require("express");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const helper = require("./helperfunctions.js");

let db = admin.firestore();

const app = express.Router();

function throwError(err, res)
{
    res.status(500).send(err.toString());
}

app.post("/", async (req, res) => {
    let payload = req.body;

    // converts to lowercase
    payload.username = payload.username.toLowerCase();
    payload.email = payload.email.toLowerCase();
    var errors = [];

    await db.collection("users").where("username","==",payload.username).get()
    .then((snapshot) => {
        if(!snapshot.empty) // found username match
        {
            errors.push(100);
        }
    })
    .catch((err) => {
        console.log("Error fetching usernames: ",err);
    })

    await db.collection("users").where("email","==",payload.email).get()
    .then((snapshot) => {
        if(!snapshot.empty) // found email match
        {
            errors.push(200);
        }
    })
    .catch((err) => {
        console.log("Error fetching emails: ",err);
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
        payload.encrypted = bcrypt.hashSync(payload.password, 10);

        delete payload.confirmpassword;
        delete payload.password;

        let docRef = db.collection("users").doc();
        await docRef.set(payload);

        let token = helper.generateAuthToken({_id: docRef.id, username: payload.username});
        res.header("token", token).json({ success: true, val: {
            _id: docRef.id,
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