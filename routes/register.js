const router = require("express").Router();
const {feedbackUserForm, registerUserLog} = require("../utils");
var url = require("url");
const { v4: uuidv4 } = require('uuid');


// Feedback user
router.get("/feedback-form", async (req, res) => {
	const current_url = url.parse(req.url, true);
	const params = current_url.query;

	const feedbackDetails = require("../models/feedback");
	const regDetails = require("../models/reguser");
	let regtoken = await regDetails.find({ feedbackToken: String(params.token) });
	let istokenpresent = await feedbackDetails.find({ feedbackToken: String(params.token) });
	if (istokenpresent.length != 0 && regtoken.length != 0) {
		// res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).send("<h1>Thanks for giving feedback!</h1>");
		
	} else if (istokenpresent.length == 0 && regtoken.length != 0) {
		res.render("feedback-form", { token: params.token });
	}
	else {
		res.status(200).send("<h1>Invalid Token!</h1>");
	}


});

router.post("/feedback-form", async (req, res) => {
	const regDetails = require("../models/reguser");
	const feedbackDetails = require("../models/feedback");
	const current_url = url.parse(req.url, true);
	const params = current_url.query;
	const token = params.token;	

	// console.log(req.body);

	const reguser = require("../models/reguser");
	const feedData = {
		rating: req.body.rating,
		feedback: req.body.feed,
		token: params.token
	};

	// console.log("feedData = ",feedData);
	try {
		await feedbackUserForm(req, feedData);
		// res.setHeader("Content-Type", "application/json");
		// res.end(JSON.stringify({ msg: "Feedback Filled!", ...feedData }));
		res.status(200).send("<h1>Thanks for giving feedback!</h1>");
	} catch (err) {
		console.log("ERROR = \n", err);
	}
});

// Register user
router.post("/register", async (req, res) => {
	console.log(req.body);
	const regDetails = require("../models/reguser");
	let ispresent = await regDetails.find({ email: req.body.email });
	console.log("ispresent = ", ispresent.length);

	if (ispresent.length != 0) {
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify({ msg: "Already Registered!" }));
	}
	else {
		console.log(req.body);
		const reguser = require("../models/reguser");
		const data = {
			feedbackToken: String(uuidv4()),
			name: req.body.name,
			email: req.body.email,
		};
		try {
			await registerUserLog(req, data);
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify({ msg: "Registered!", ...data }));
		} catch (err) {
			console.log("ERROR = \n", err);
		}
	}
});

router.get("/register", async (req, res) => {
	res.render("register", {
	});
});


router.get("/regpublicmenow", async (req, res) => {
	const regDetails = require("../models/reguser");
	let regdata = await regDetails.find().lean();
	
	// const request = require('request');
	// const csv = require('csvtojson');
	// const url = `https://docs.google.com/spreadsheets/d/e/${process.env.SPREADSHEET_ID}/pub?gid=${process.env.SHEET_ID}&single=true&output=csv`;

	// request.get(url, (error, response, body) => {
	// if (error) {
	// 	console.error(error);
	// 	return;
	// }

	// csv()
	// 	.fromString(body)
	// 	.then((jsonObj) => {
	// 	// Do something with the JSON data
	// 	console.log(jsonObj);
	// 	});
	// });


	res.render("regpublic", {
		alluserinfo: regdata,
		totalreg: regdata.length,
	});
});


router.get("/feedmenow", async (req, res) => {
	const regDetails = require("../models/reguser");
	const feedDetails = require("../models/feedback");

	// let regdata = await regDetails.find().lean();
	let feeddata = await feedDetails.find().lean();

	// console.log('reg = ', feeddata);

	let arr = [];
	for (let i = 0; i < feeddata.length; i++) {
		let user = await regDetails.find({ feedbackToken: String(feeddata[i].feedbackToken) });
		if (user) {
			user[0]["desc"] = feeddata[i].desc;
			user[0]["rating"] = feeddata[i].rating;
			arr.push(...user);
		}
	}
	res.render("feedbacks", {
		feedinfo: arr,
		totalfeed: arr.length,
	});
});

module.exports = router;