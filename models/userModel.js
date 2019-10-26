const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    username: String,
    password: String,
    title: String,
    firstname: String,
    lastname: String,
    gender: String,
    tel: String,
    url: String,
    job: String,
    workplace: String,
    birthdate: Date
}, { timestamps: true, versionKey: false })

const userModel = mongoose.model("User",userSchema);

module.exports = userModel;