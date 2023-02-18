const router = require("express").Router();
const {registerUserLog} = require("../utils");
var url = require("url");
const { v4: uuidv4 } = require('uuid');


// Feedback user
router.post("/feedback", async (req, res) => {
	console.log(req.body);
	const regDetails = require("../models/reguser");
	const feedbackDetails = require("../models/feedback");

	const ispresent = await regDetails.find({ email: req.body.email });
	
	console.log("ispresent = ", ispresent.length);
	
	if (ispresent.length === 0) {
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify({ msg: "Already Registered!" }));
	}else {
		console.log(req.body);
		const reguser = require("../models/reguser");
		const feedData = {
			name: req.body.name,
			email: req.body.email,
		};
		try {
			await registerUserLog(req, data);
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify({ msg: "Registered!", ...feedData }));
		} catch (err) {
			console.log("ERROR = \n", err);
		}
	}
});


router.get("/feedback/:token", async (req, res) => {
	const token = req.params["token"];
	const regDetails = require("../models/reguser");
	let istokenpresent = await regDetails.find({ feedbackToken: String(token) });

	if (istokenpresent) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(`You Have already given feedback =  ${token}!`);		
	} else {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(`Not Found!`);
	}
	res.writeHead(200, {'Content-Type': 'text/plain'});
  	res.end(`Hello ${token}!`);
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
