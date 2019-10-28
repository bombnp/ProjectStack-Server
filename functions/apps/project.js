const express = require("express");
const Project = require("../models/projectModel.js");

const app = express.Router();

app.get("/project/", (req, res) => {
    Project.find({},(err, result) => {
        if(err) res.status(500).send(err.toString());
        res.json(result);
    })
})

app.post("/project/create", (req, res) => {
    var project = new Project(req.body);
    project.save();
    res.sendStatus(201);
})

module.exports = app;

