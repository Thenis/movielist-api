const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("./../config/utils.js");

router.get("/", (req, res) => {
	res.render("home.hbs");
});

router.get("/register", (req, res) => {
	res.render("register.hbs");
});

router.get("/login", (req, res) => {
	res.render("login.hbs");
});

router.get("/view-lists", (req, res) => {
	//console.log(req.cookies["x-auth"]);
	console.log(isAuthenticated(req.cookies["x-auth"]));
	res.render("view-lists.hbs");
});

router.get("/add-list", (req, res) => {
	res.render("add-list.hbs");
});

router.get("/add-movie", (req, res) => {
	res.render("add-movie.hbs");
});

module.exports = router;