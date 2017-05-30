const express = require("express");
const _ = require("lodash");
const bodyParser = require("body-parser");
const cors = require('cors')
const { ObjectId } = require("mongodb");
const hbs = require("hbs");

let mongoose = require("./db/mongoose.js");
let users = require("./routes/users.js")
let index = require("./routes/index.js")
let lists = require("./routes/lists.js");
let app = express();

const port = 3000;

//Parse incoming requsts to json middleware. Populates the req.body with params
app.use(bodyParser.urlencoded({
	extended: false
}));
//Parse incoming requsts to json middleware. Populates the req.body with params
app.use(bodyParser.json());

const corsOptions = {
	origin: "*",
	methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
	preflightContinue: false,
	optionsSuccessStatus: 204,
	exposedHeaders: ["x-auth"]
}

//console.log(__dirname + "\\..\\views\\");
//Allows cross-origin resource sharing
app.use(cors(corsOptions));

app.set("view engine", "hbs");

hbs.registerPartials(__dirname + "./../views/partials");

app.use(express.static(__dirname + "./../public"));


app.use(users);
app.use(index);

app.use(lists);

app.listen(port, () => {
	console.log(`App starting on localhost:${port}`);
});

module.exports = {
	app
};