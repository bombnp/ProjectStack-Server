const jwt = require("jsonwebtoken");
const private_key = require("../config/properties.js").private_key;

function generateAuthToken(payload){
    return jwt.sign(payload, private_key);
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJib21iLm5wQGdtYWlsLmNvbSIsImlhdCI6MTU3MjMzMTk4MX0.c3FQkb8E8G7YGBGdozQ4KGnMWW2L0js7GNpZhChH0go

function checkAuthen(req, res, next){
    const token = req.cookies.token;
    if(!token)
        return res.status(401).send("Access Denied. No token provided");
    try {
        req.user = jwt.verify(token, private_key);
        next();
    }
    catch (err) {
        res.status(402).send("Access Denied. Invalid token");
    }
}

module.exports = {
    generateAuthToken,
    checkAuthen
}