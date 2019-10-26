const express = require("express");
const User = require("../models/userModel.js");

const app = express.Router();

app.post("/create", (req, res) => {
    var user = new User(req.body);
    user.save();
    res.sendStatus(201);
})

app.get("/info", (req, res) => {
    User.find((err, result) => {
        if(err) return res.status(500).send(err.toString());
        res.json(result);
    });
})

app.get("/:name", (req, res) => {
    query = { name: req.params.name};
    User.find(query, (err, result) => {
        if(err) return res.status(500).send(err.toString());
        res.json(result);
    });
})

app.post("/edit/:email", (req, res) => {
    query = { email : req.params.email };
    User.updateOne(query, { $set: req.body}, (err, result) => {
        if (err) return res.status(500).send(err.toString());
        res.sendStatus(200);
    })
})

app.delete("/:email", (req, res) => {
    query = { email : req.params.email };
    User.deleteOne(query, (err, result) => {
        if (err) return res.status(500).send(err.toString());
        if(result.deletedCount == 1)
            res.send("Deleted successfully")
        else
            res.send("Email not found");
    })
})

app.delete("/deleteall/:password", (req, res) => {
    if(req.params.password == "1a8d7c2b0B")
        User.deleteMany((err) => {
            if (err) return res.status(500).send(err.toString());
            res.send("Deleted all documents successfully")
        })
    else
        res.send("Wrong Password");
})

module.exports = app;