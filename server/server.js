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
let lists = require("./routes/lists.js");
let app = express();

const port = 3000;

//Parse incoming requsts to json middleware. Populates the req.body with params
app.use(bodyParser.urlencoded({
	extended: false
}));
//Parse incoming requsts to json middleware. Populates the req.body with params
app.use(bodyParser.json());

app.use(cookieParser());


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


// hbs.registerHelper("authToken", function() {
// 	let token = req.app.locals.token;
// 	return token;
// })

hbs.registerHelper('log', function(a) {
    console.log(a);
});

app.use(express.static(__dirname + "./../public"));

app.use(function(req, res, next) {
	// if (isAuthenticated(req.cookies["x-auth"])) {
	// 	res.locals.authenticated = true
	// }

	//console.log(req.cookies["x-auth"])
	next();
})
app.use(users);

app.use(index);



app.use(lists);

app.listen(port, () => {
	console.log(`App starting on localhost:${port}`);
});

module.exports = {
	app
};