const app_names = require("./config/properties.js").app_names;
let routers = []
app_names.forEach((app_name) => {
    routers.push(require("./apps/"+app_name));
})
module.exports = routers