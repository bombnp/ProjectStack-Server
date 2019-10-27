const express = require("express");
const User = require("../models/userModel.js")

const app = express.Router();

function throwError(err, res)
{
    res.status(500).send(err.toString());
}
app.post("/", (req, res) => {
    var userinfo = req.body;
    // converts to lowercase
    console.log(typeof userinfo);
    console.log(userinfo);
    userinfo.username = userinfo.username.toLowerCase();
    userinfo.email = userinfo.email.toLowerCase();
    var errors = [];

    User.find({username: userinfo.username}, (err, result) => {
        if(err) throwError(err, res);
        errors.push("Username already exists");
    })

    User.find({email: userinfo.email}, (err, result) => {
        if(err) throwError(err, res);
        errors.push("Email already exists");
    })

    if(userinfo.password.length < 8)
        errors.push("Password length < 8");
    if(userinfo.password.toLowerCase() == userinfo.password)
        errors.push("Password no uppercase");
    if(userinfo.password.toUpperCase() == userinfo.password)
        errors.push("Password no lowercase");

    if(userinfo.password != userinfo.confirmpassword)
        errors.push("Passwords do not match");

    if(errors.length > 0)
        res.json(errors);
})

module.exports = app;

