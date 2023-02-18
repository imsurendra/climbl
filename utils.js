const { create } = require("connect-mongo");
var url = require("url");

module.exports = {
	// hashtagsInfo: async function () {
	// 	const Info = require("./models/hashtags");
	// 	let info = await Info.find().lean();
	// 	return info;
	// },
	
	registerUserLog: async function (req, data) {
		const regDetails = require("./models/reguser");
		// let mealdata = await regDetails.find({ UserId: String(userID) });
		// let user_id = String(req.user._id);
		let newreg = new regDetails({
			displayName: data.name,
			email: data.email
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
