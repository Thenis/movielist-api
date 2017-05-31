const mongoose = require("mongoose");

let ListSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 1
	},
	description: {
		type: String,
		required: false
	},
	_creator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	movies: [{
		movieName: {
			type: String,
			required: true
		}
	}]
})

let List = mongoose.model("List", ListSchema);

module.exports = {
	List
}