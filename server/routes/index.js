const express = require("express");
const router = express.Router();
let { authenticate } = require("./../middleware/authenticate.js");
let { List } = require("./../models/list.js");

router.get("/", (req, res) => {
	res.render("home.hbs");
});

router.get("/register", (req, res) => {
	res.render("register.hbs");
});

router.get("/login", (req, res) => {
	res.render("login.hbs");
});

router.get("/add-list", authenticate, (req, res) => {
	res.render("add-list.hbs");
});

router.get("/add-movie", authenticate, (req, res) => {
	List.find({
		_creator: req.user._id
	}).then((lists) => {
		res.render("add-movie.hbs", { lists });
	})
});

module.exports = router;