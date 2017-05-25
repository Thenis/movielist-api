const mongoose = require("mongoose");

let ListSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 1
	},
	_creator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	movies: [{
		movieId: {
			type: Number,
			required: true
		}
	}]
})

let List = mongoose.model("List", ListSchema);

module.exports = {
	List
}