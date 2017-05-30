const jwt = require("jsonwebtoken");

let isAuthenticated = (token) => {
    try {
        jwt.verify(token, "abc123")
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = {
    isAuthenticated
}