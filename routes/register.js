const router = require("express").Router();
const {registerUserLog} = require("../utils");
var url = require("url");

// Register user
router.post("/register", async (req, res) => {
	console.log(req.body);
	const reguser = require("../models/reguser");
	const data = {
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
});

router.get("/register", async (req, res) => {
	res.render("register", {
	});
});

module.exports = router;
