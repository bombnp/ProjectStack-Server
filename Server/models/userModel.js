const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    surname: String,
    password: String,
    url: String,
    email: String,
    tel: String,
    occupation: String,
    workplace: String,
    birthdate: Date
}, { timestamps: true, versionKey: false })

const userModel = mongoose.model("User",userSchema);

module.exports = userModel;