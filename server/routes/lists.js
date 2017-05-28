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
		res.send(list);
	}).catch((err) => res.status(400).send(err))
});

// Get all lists created by specific user
router.get("/lists", authenticate, (req, res) => {
	List.find({
		_creator: req.user._id
	}).then((lists) => {
		res.send(lists);
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

router.patch("/lists/:id/addmovie", authenticate, (req, res) => {
	let id = req.params.id;
	let body = _.pick(req.body, ["movieId"]);

	if (!ObjectId.isValid(id) || !ObjectId.isValid(body.movieId)) {
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
	let body = _.pick(req.body, ["movieId"]);

	if (!ObjectId.isValid(id) || !ObjectId.isValid(body.movieId)) {
		res.status(404).send();
	}


	List.update({
		_id: id,
		_creator: req.user._id
	}, {
			$pull: {
				movies: {
					_id: body.movieId
				}
			}
		}).then((list) => {
			res.send(list)
		}).catch((err) => res.send(404).send());
});

module.exports = router;