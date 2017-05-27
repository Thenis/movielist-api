const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// User schema
let UserSchema = new mongoose.Schema({
	username: {
		unique: true,
		required: true,
		type: String,
		minlength: 1
	},
	password: {
		required: true,
		type: String,
		minlength: 6
	},
	tokens: [{
		_id: false,
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



UserSchema.methods.generateAuthToken = function () {
	let user = this;
	let access = "auth"
	let token = jwt.sign({
		_id: user._id.toString(16),
		access
	}, "abc123").toString();

	let tokens = {
		access,
		token
	};

	user.tokens.push(tokens);

	return user.save().then(() => { // returned so it can be chained with a promise in server.js
		return token;
	});
}

UserSchema.methods.removeToken = function (token) {
	let user = this;

	return user.update({
		$pull: {
			tokens: {
				token: token
			}
		}
	})
}

UserSchema.statics.findUserAndVerifyLogin = function (username, password) {
	let User = this;

	return User.findOne({
		username
	}).then((user) => {
		if (!user) {
			return Promise.reject();
		}

		return bcrypt.compare(password, user.password).then((res) => {
			if (res) {
				return user;
			} else {
				return Promise.reject();
			}
		})
	});
}

UserSchema.statics.findByToken = function (token) {
	let User = this;
	let decoded;

	try {
		decoded = jwt.verify(token, "abc123")
	} catch (e) {
		return Promise.reject();
	}

	return User.findOne({
		_id: decoded._id,
		"tokens.access": "auth",
		"tokens.token": token
	});
}

//middleware to run before the save function of an user
UserSchema.pre("save", function (next) {
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

// Wait for all indexes on the 'users' collection to finish building
User.on('index', function (error) {
	if (error) {
		console.log(error)
	}
});

module.exports = {
	User
}