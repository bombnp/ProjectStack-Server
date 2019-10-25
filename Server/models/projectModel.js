const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: String,
    tags: [String],
    content: String
}, { timestamps: true, versionKey: false })

const projectModel = mongoose.model("Project",projectSchema);

module.exports = projectModel;