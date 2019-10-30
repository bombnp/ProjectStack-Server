const express = require("express");
const admin = require("firebase-admin");
const bcrypt = require("bcrypt");
const helper = require("./utilityfunctions.js");

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
        let data = {
            username: payload.username,
            password : bcrypt.hashSync(payload.password,10),
            email: payload.email,
            title: payload.title,
            firstName: payload.firstName,
            lastName: payload.lastName,
            tel: payload.tel,
            job: payload.job,
            workplace: payload.workplace,
            teams: []
        };
        
        db.collection("users").add(data).then((docRef) => {

            let token = helper.generateAuthToken({_id: docRef.id, username: data.username});

            res.json({
                success: true,
                val: {
                    _id: docRef.id,
                    username: data.username
                }
            });
            
        }).catch((err) => {
            next(err);
        });
    }
})

app.post("/login", (req, res, next) => {
    let payload = req.body;

    payload.loginname = payload.loginname.toLowerCase();

    if(payload.loginname.includes("@")){ // login with email
        
        db.collection("users").doc(payload.loginname).get()
        .then((docSnapshot) => {
            if(docSnapshot.exists)
            {
                if(bcrypt.compareSync(payload.password, docSnapshot.get("password")))
                {
                    let token = helper.generateAuthToken({
                        _id: payload.loginname
                    });
                    res.json({
                        success: true,
                        val: {
                            token: token,
                            _id: docSnapshot.id,
                            username: docSnapshot.get("username")
                        }
                    }) // success
                }
                else
                    res.json({
                        success: false,
                        val: [401]
                    }) // password mismatch
            }
            else
                res.json({
                    success: false,
                    val: [402]
                }) // loginname not found
        })
        .catch((err) => {
            next(err);
        })
    }
    else { // login with username

        db.collection("users").where("username", "==", payload.loginname).get()
        .then((querySnapshot) => {
            if(!querySnapshot.empty)
            {
                querySnapshot.docs.forEach((docSnapshot) => {
                    if(bcrypt.compareSync(payload.password, docSnapshot.get("password")))
                    {
                        let token = helper.generateAuthToken({
                            _id: docSnapshot.id
                        });
                        res.json({
                            success: true, val: {
                                token: token,
                                _id: docSnapshot.id,
                                username: docSnapshot.get("username")
                        }}) // success
                    }
                    else
                        res.json({ success: false, val: [401] })
                })
            }
            else
                res.json({
                    success: false,
                    val: [402]
                })
        })
        .catch((err) => {
            next(err);
        })
    }
})
module.exports = app;