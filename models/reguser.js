const mongoose = require("mongoose");

const regUserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	displayName: {
		type: String,
		required: true,
	},
	phoneno: {
		type: String,
		required: false,
	},
	rollno: {
		type: String,
		required: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	feedbackToken: {
		type: String,
		required: false,
	}
});

module.exports = mongoose.model("regUserDetails", regUserSchema);
