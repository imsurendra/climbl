const mongoose = require("mongoose");

const regUserSchema = new mongoose.Schema({
    rating: {
		type: Number,
		required: false,
	},	
    desc: {
		type: String,
		required: false,
	},
    createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("regUserDetails", regUserSchema);
