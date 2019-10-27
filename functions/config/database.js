const mongoose = require("mongoose");
const URI = require("./properties").dbURI;

module.exports = () =>{

    console.log("Connecting to MongoDB...");
    mongoose.connect(URI,{useNewUrlParser : true, useUnifiedTopology : true});
    mongoose.connection.on("connected",() => {
        console.log("Connected to MongoDB successfully");
    })

    mongoose.connection.on("error", (err) => {
        console.error("Error connecting to MongoDB: ",err);
    })
    
    mongoose.connection.on("disconnected", () => {
        console.log("Disconnected from MongoDB");
    })
}