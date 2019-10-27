const functions = require('firebase-functions');
const admin = require("firebase-admin")
const express = require("express");
const bodyParser = require("body-parser");
const properties = require("./config/properties.js");

admin.initializeApp(functions.config().firebase);

const app = require("./server.js");

module.exports.app = functions.runWith({ timeoutSeconds : 120}).https.onRequest(app);