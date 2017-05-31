const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const _ = require("lodash");

let { List } = require("./../models/list.js");
let { authenticate } = require("./../middleware/authenticate.js"); //authentication by user token middleware

// Create new list
router.post("/lists", authenticate, (req, res) => {
	let body = _.pick(req.body, ["name", "description"]);

	let list = new List({
		name: body.name,
		description: body.description,
		_creator: req.user._id
	})

	list.save().then(() => {
		res.redirect(301, "/lists");
	}).catch((err) => res.status(400).send(err))
});

// Get all lists created by specific user
router.get("/lists", authenticate, (req, res) => {
	List.find({
		_creator: req.user._id
	}).then((lists) => {
		res.render("view-lists.hbs", { lists });
	}).catch((err) => res.status(401).send())
});

// Delete list by id
router.delete("/lists/remove/:id", authenticate, (req, res) => {
	let id = req.params.id;

	if (!ObjectId.isValid(id)) {
		res.status(404).send();
	}

	List.findOneAndRemove({
		_id: id,
		_creator: req.user._id
	}).then((list) => {
		if (!list) {
			res.status(404).send();
		}
		res.send(list);
	}).catch((err) => res.status(400).send());
});

router.get("/movie-list/:id", authenticate, (req, res) => {
	let id = req.params.id;

	if (!ObjectId.isValid(id)) {
		res.status(404).send();
	}

	List.findOne({
		_id: id,
		_creator: req.user._id
	}).then((list) => {
		let listName = list.name
		let movies = list.movies;
		res.render("view-movies.hbs", { movies, listName });
	});
});

router.patch("/lists/:id/addmovie", authenticate, (req, res) => {
	let id = req.params.id;
	let body = _.pick(req.body, ["movieName"]);

	if (!ObjectId.isValid(id)) {
		res.status(404).send();
	}

	List.findOneAndUpdate({
		_id: id,
		_creator: req.user._id
	}, {
			$push: {
				movies: body
			}
		}).then((list) => {
			res.send(list);

		}).catch((err) => res.status(404).send({
			error: "ID does not exist."
		}));
});

router.delete("/lists/:id/deletemovie", authenticate, (req, res) => {
	let id = req.params.id;
	let body = _.pick(req.body, ["movieName"]);

	if (!ObjectId.isValid(id)) {
		res.status(404).send();
	}

	List.update({
		_id: id,
		_creator: req.user._id
	}, {
			$pull: {
				movies: {
					_id: body.movieName
				}
			}
		}).then((list) => {
			res.send(list)
		}).catch((err) => res.send(404).send());
});

module.exports = router;