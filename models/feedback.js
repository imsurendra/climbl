const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    rating: {
		type: Number,
		required: false,
	},	
    desc: {
		type: String,
		required: false,
	},
	feedbackToken: {
		type: String,
		required: true,
	},
    createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("feedbackDetails", feedbackSchema);
