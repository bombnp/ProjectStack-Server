const app_names = require("./config/properties.js").app_names;
const path = require("path");

module.exports = (app) => {    
    app_names.forEach((app_name) => {
        app.use("/",require("./apps/"+app_name));
    })
    
    // app.get("/", (req, res) => {
    //     res.render("index.html");
    // })

    // app.get("/style/*.css", (req, res) => {
    //     res.sendFile("/web/style/ustyle.css");
    // })

    app.get("/login", (req, res) => {
        res.sendFile("Login.html", {
            root: path.join(__dirname,"/web/page")
        });
    })

    app.get("/test", (req, res) => {
        res.render('page/testvariable', {
            name: 'saenyakorn'
        });
    })
}