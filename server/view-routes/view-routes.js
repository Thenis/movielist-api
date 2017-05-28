const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.render("home.hbs");
});

router.get("/register", (req, res) => {
	res.render("register.hbs");
});

router.get("/view-lists", (req, res) => {
	res.render("view-lists.hbs");
});

router.get("/add-list", (req, res) => {
	res.render("add-list.hbs");
});

router.get("/add-movie", (req, res) => {
	res.render("add-movie.hbs");
});

module.exports = router;