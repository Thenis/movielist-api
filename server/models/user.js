const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


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
		}
	}, {
		token: {
			type: String,
			required: true
		}
	}]
});

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
	} else{
		next();
	}

});

UserSchema.post("save", function (user) {
	console.log(`User ${user.email} has been created`);
})

// Creating user model by giving the schema and the name of the model
let User = mongoose.model("User", UserSchema);



module.exports = {
	User
}