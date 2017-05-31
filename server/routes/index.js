const express = require("express");
const router = express.Router();
let { authenticate } = require("./../middleware/authenticate.js"); 



router.get("/", (req, res) => {
	res.render("home.hbs");
});

router.get("/register", (req, res) => {
	res.render("register.hbs");
});

router.get("/login", (req, res) => {
	res.render("login.hbs");
});

router.get("/view-lists", authenticate, (req, res) => {
	res.render("view-lists.hbs");
});

router.get("/add-list", authenticate, (req, res) => {
	res.render("add-list.hbs");
});

router.get("/add-movie", authenticate, (req, res) => {
	res.render("add-movie.hbs");
});

module.exports = router;