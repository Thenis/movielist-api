const express = require("express");
const _ = require("lodash");
const bodyParser = require("body-parser");
const {ObjectId} = require("mongodb");

let mongoose = require("./db/mongoose.js");
let {
	User
} = require("./models/user.js");
let {
	List
} = require("./models/list.js");
let {
	authenticate
} = require("./middleware/authenticate.js"); //authentication by user token middleware

let app = express();

const port = 3000;

//Parse incoming requsts to json middleware. Populates the req.body with params
app.use(bodyParser.json());


//Registration
app.post("/users", (req, res) => {
	let body = _.pick(req.body, ["username", "password"]); // get only the username and password from the request body

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
app.post("/users/login", (req, res) => {
	let body = _.pick(req.body, ["username", "password"]);

	User.findUserAndVerifyLogin(body.username, body.password).then((user) => {
		return user.generateAuthToken().then((token) => {
			res.header("x-auth", token).send();
		})
	}).catch((err) => res.status(400).send(err))
});

// Logoff
app.delete("/users/logoff", authenticate, (req, res) => {
	req.user.removeToken(req.token).then(() => {
		res.send();
	}, () => {
		res.status(400).send();
	})
});

// Create new list
app.post("/lists", authenticate, (req, res) => {
	let body = _.pick(req.body, ["name"]);

	let list = new List({
		name: body.name,
		_creator: req.user._id
	})

	list.save().then(() => {
		res.send(list);
	}).catch((err) => res.status(400).send(err))
});

// Get all lists created by specific user
app.get("/lists", authenticate, (req, res) => {
	List.find({
		_creator: req.user._id
	}).then((lists) => {
		res.send(lists);
	}).catch((err) => res.status(401).send())
});

app.patch("/lists/:id/addmovie", authenticate, (req, res) => {
	let id = req.params.id;
	let body = _.pick(req.body, ["movieId"]);

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

app.delete("/lists/:id/deletemovie", authenticate, (req, res) => {
	let id = req.params.id;
	let body = _.pick(req.body, ["movieId"]);

	if (!ObjectId.isValid(id) || !ObjectId.isValid(body.movieId)) {
		res.status(404).send();
	}
	

	List.update(id, {
		$pull: {
			movies: {
				_id: body.movieId
			}
		}
	}).then((list) => {
		res.send(list)
	}).catch((err) => res.send(404).send());
});


app.listen(port, () => {
	console.log(`App starting on localhost:${port}`);
});

module.exports = {
	app
};