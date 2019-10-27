const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name : String,
    tags : { type: [String], default: []},
    content : { type: String, default: ""}
}, { timestamps: true, versionKey: false })

const projectModel = mongoose.model("Project",projectSchema);

module.exports = projectModel;