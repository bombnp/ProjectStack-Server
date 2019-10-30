const app_names = require("./config/properties.js").app_names;

module.exports = (app) => {    
    app_names.forEach((app_name) => {
        app.use("/",require("./apps/"+app_name));
    })
    
    app.get("/", (req, res) => {
        res.render("index.html");
    })
}