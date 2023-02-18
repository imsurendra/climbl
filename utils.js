const { create } = require("connect-mongo");
var url = require("url");

module.exports = {	
	feedbackUserForm: async function (req, data) {
		const feedbackDetails = require("./models/feedback");
		let newfeed = new feedbackDetails({
			feedback: data.feedback,
		});

		newreg.save(function (err) {
			if (err) {
				console.log(err.errors);
				return err;
			} else {
				console.log("Success!");
			}
		});	
	},
	
	registerUserLog: async function (req, data) {
		const regDetails = require("./models/reguser");
		// let mealdata = await regDetails.find({ UserId: String(userID) });
		// let user_id = String(req.user._id);
		let newreg = new regDetails({
			displayName: data.name,
			email: data.email,
			feedbackToken: data.feedbackToken,

		});

		newreg.save(function (err) {
			if (err) {
				console.log(err.errors);
				return err;
			} else {
				console.log("Success!");
			}
		});
	},
};
