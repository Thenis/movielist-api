const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const _ = require("lodash");
const bodyParser = require("body-parser");

let { User } = require("./../models/user.js");
let { authenticate } = require("./../middleware/authenticate.js"); //authentication by user token middleware

//Parse incoming requsts to json middleware. Populates the req.body with params


router.post("/", (req, res) => {
    let body = _.pick(req.body, ["username", "password"]); // get only the username and password from the request body
    //console.log(req)
    // create new user
    let user = new User({
        username: body.username,
        password: body.password
    });

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header("x-auth", token).send(user)
    }).catch((err) => res.status(400).send(err))
});

// Login
router.post("/login", (req, res) => {
    let body = _.pick(req.body, ["username", "password"]);
    //console.log(req);
    User.findUserAndVerifyLogin(body.username, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header("x-auth", token).send();
        })
    }).catch((err) => res.status(400).send(err))
});

// Logoff
router.delete("/logoff", authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.send();
        console.log("logged off");
    }, () => {
        res.status(400).send();
    })
});

module.exports =  router;