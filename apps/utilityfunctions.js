const jwt = require("jsonwebtoken");
const private_key = require("../config/properties.js").private_key;

function generateAuthToken(payload){
    return jwt.sign(payload, private_key, { expiresIn: "1w" });
}

function checkAuthen(req, res, next){
    const token = req.cookies.token;
    if(!token)
        return res.redirect("https://projectstack.now.sh/login");
    try {
        req.user = jwt.verify(token, private_key);
        next();
    } catch (err) {
        res.redirect("https://projectstack.now.sh/login");
    }
}

function refreshToken(req, res, next){
    let token = req.cookies.token;
    if(!token){
        res
        .clearCookie("token")
        .clearCookie("username")
        .clearCookie("profilepic_url");
        next();
    }
    try {
        let payload = jwt.verify(token, private_key);
        token = generateAuthToken({ username: payload.username, profilepic_url: payload.profilepic_url});
        res
        .cookie("token", token)
        .cookie("username", payload.username)
        .cookie("profilepic_url", payload.profilepic_url);
        next();
    } catch (err) {
        res
        .clearCookie("token")
        .clearCookie("username")
        .clearCookie("profilepic_url");
        next();
    }

}

module.exports = {
    generateAuthToken,
    checkAuthen,
    refreshToken
}