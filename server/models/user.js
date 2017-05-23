const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


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
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});

UserSchema.methods.generateAuthToken = function() {
	let user = this;
	let access = "auth"
	let token = jwt.sign({
		_id: user._id.toString(16),
		access
	}, "abc123").toString();

	let tokens = {access, token};

	user.tokens.push(tokens);

	return user.save().then(() => { // returned so it can be chained with a promise in server.js
		return token;
	});
}

//middleware to run before the save function of an user
UserSchema.pre("save", function(next) {
	let user = this;
	if (user.isModified("password")) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			})
		})
	} else {
		next();
	}

});

// Creating user model by giving the schema and the name of the model
let User = mongoose.model("User", UserSchema);



module.exports = {
	User
}