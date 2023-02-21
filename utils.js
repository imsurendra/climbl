const { create } = require("connect-mongo");
var url = require("url");
const { v4: uuidv4 } = require('uuid');

module.exports = {	
	feedbackUserForm: async function (req, data) {
		const feedbackDetails = require("./models/feedback");
		let newfeed = new feedbackDetails({
			rating: data.rating,
			desc: data.feedback,
			feedbackToken: data.token
		});

		console.log("feedback = ", data.feedback);
		newfeed.save(function (err) {
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

	updateRegDB: async function (data) {
		const regDetails = require("./models/reguser");		

		console.log("dadadad = ", data.length);
		for (let i = 0; i < data.length; i++) {
			let user = await regDetails.find({ email: data[i]['Email Address']});
			let phoneexist = await regDetails.find({ phoneno: data[i]['Mobile Number'] });

			if (user.length != 0 && phoneexist.length == 0) {
				console.log("updateregdb")
				await regDetails.updateOne(
					{ email: data[i]['Email Address'] },
					{
						phoneno: data[i]['Mobile Number'],
						rollno: data[i]['Roll Number'],
					}
				)
			}			
			// else create new reg in mongodb
			else if (user.length == 0) {
				console.log("creating new reg from google sheet")
				let newreg = new regDetails({
					displayName: data[i].Name,
					email: data[i]['Email Address'],
					phoneno: data[i]['Mobile Number'],
					rollno: data[i]['Roll Number'],
					feedbackToken: String(uuidv4()),
				});

				newreg.save(function (err) {
					if (err) {
						console.log(err.errors);
						return err;
					} else {
						console.log("Success!");
					}
				});

			}
			else {
				console.log("NO NEED");
			}
	
		}
		return;
	}
};
