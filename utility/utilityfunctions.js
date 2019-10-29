const jwt = require("jsonwebtoken");
const private_key = require("../config/properties.js").private_key;

function generateAuthToken(payload){
    return jwt.sign(payload, private_key);
}

function vertifyToken(token){
    return jwt.verify(token, private_key);
}

module.exports = {
    generateAuthToken
}