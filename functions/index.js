const functions = require('firebase-functions');
const admin = require("firebase-admin")

admin.initializeApp(functions.config().firebase);

const app = require("./server.js");

module.exports.app = functions.runWith({ timeoutSeconds : 120}).https.onRequest(app);