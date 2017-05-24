const express = require("express");
const _ = require("lodash");
const bodyParser = require("body-parser");

let mongoose = require("./db/mongoose.js");
let {
	User
} = require("./models/user.js");

let app = express();

const port = 3000;

//Parse incoming requsts to json middleware. Populates the req.body with params
app.use(bodyParser.json());


//Registration
app.post("/users", (req, res) => {
	let body = _.pick(req.body, ["email", "password"]); // get only the email and password from the request body

	// create new user
	let user = new User({
		email: body.email,
		password: body.password
	});

	user.save().then(() => {
		return user.generateAuthToken();
	}).then((token) => {
		res.header("x-auth", token).send(user)
	}).catch((err) => res.status(400).send(err))
});



app.listen(port, () => {
	console.log(`App starting on localhost:${port}`);
});