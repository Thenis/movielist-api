let { User } = require("./../models/user.js");

let authenticate = (req, res, next) => {
	let token = req.cookies["x-auth"];

	User.findByToken(token).then((user) => {
		if (!user) {
			return Promise.reject();
		}

		req.token = token;
		req.user = user;
		next();
	}).catch((err) => {
		res.status(401).send();
	});
}

module.exports = {
	authenticate
}