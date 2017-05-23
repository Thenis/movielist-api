const express = require("express");

let mongoose = require("./db/mongoose.js");

let app = express();

const port = 3000;



app.listen(port, () => {
	console.log(`App starting on localhost:${port}`);
})