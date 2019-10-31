const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinary_config = require("../config/cloudinary_config.js");
const cloudinaryStorage = require("multer-storage-cloudinary");
const admin = require("firebase-admin");
const defaultPicURL = require("../config/properties.js").defaultProfilePic;

cloudinary.config({
    cloud_name: cloudinary_config.CLOUD_NAME,
    api_key: cloudinary_config.API_KEY,
    api_secret: cloudinary_config.API_SECRET
});

const cloudStorage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "userProfilePics",
    allowedFormats: ["jpg","png"],
    transformation: [{ width: 500, height: 500, crop: "limit"}]
});

let db = admin.firestore();

const cloudParser = multer({ storage: cloudStorage});

const app = express.Router()

app.post("/image/setprofilepic", cloudParser.single("profilepic"), (req, res, next) => {
    
})

app.post("/image/test", cloudParser.single("profilePic"), (req, res, next) => {
    console.log(req.file);
    let image = {
        url: req.file.url,
        id: req.file.public_id
    }
    console.log(image);
})

module.exports = app;