const mongoose = require("mongoose");


// User schema
let UserSchema = new mongoose.Schema({
	email: {
		required: true,
		type: String,
		minlength: 1,
		unique: true,
	},
	password: {
		required: true,
		type: String,
		minlength: 6
	},
	tokens[{
		access: {
			type: String,
			required: true
		}
	}, {
		token: {
			type: String,
			required: true
		}
	}]
});

let User = mongoose.model("User", UserSchema);