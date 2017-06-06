const express = require("express");
const _ = require("lodash");
const bodyParser = require("body-parser");
const cors = require('cors')
const { ObjectId } = require("mongodb");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");

let mongoose = require("./db/mongoose.js");
let users = require("./routes/users.js")
let index = require("./routes/index.js")
let lists = require("./routes/lists.js")
let themoviedbAPI = require("./routes/themoviedb-api.js");
let app = express();

const port = 3000;

//Parse incoming requsts to json middleware. Populates the req.body with params
app.use(bodyParser.urlencoded({
	extended: false
}));
//Parse incoming requsts to json middleware. Populates the req.body with params
app.use(bodyParser.json());

app.use(cookieParser());

//Allows cross-origin resource sharing
app.use(cors());
hbs.registerPartials(__dirname + "./../views/partials");
app.set("view engine", "hbs");

app.use(express.static(__dirname + "./../public"));

app.use(index);
app.use(users);
app.use(lists);
app.use(themoviedbAPI);

app.listen(port, () => {
	console.log(`App starting on localhost:${port}`);
});

module.exports = {
	app
};