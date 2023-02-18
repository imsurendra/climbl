const router = require("express").Router();
const {feedbackUserForm, registerUserLog} = require("../utils");
var url = require("url");
const { v4: uuidv4 } = require('uuid');


// Feedback user
router.get("/feedback-form", async (req, res) => {
	const current_url = url.parse(req.url, true);
	const params = current_url.query;
	const token = params.token;

	// res.render("feedback-form", { token: token });
	const feedbackDetails = require("../models/feedback");
	const regDetails = require("../models/reguser");
	let regtoken = await regDetails.find({ feedbackToken: String(token) });
	let istokenpresent = await feedbackDetails.find({ feedbackToken: String(token) });
	if (istokenpresent.length != 0 && regtoken.length != 0) {
		// res.writeHead(200, {'Content-Type': 'text/plain'});
		res.status(200).send("<h1>Thanks for giving feedback!</h1>");
	} else if (istokenpresent.length == 0 && regtoken.length != 0) {
		res.render("feedback-form", { token: token });
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

	console.log(req.body);

	const reguser = require("../models/reguser");
	const feedData = {
		rating: req.body.rating,
		feedback: req.body.feed,
		token: params.token
	};

	console.log("feedData = ",feedData);
	try {
		await feedbackUserForm(req, feedData);
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify({ msg: "Feedback Filled!", ...feedData }));
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

module.exports = router;
