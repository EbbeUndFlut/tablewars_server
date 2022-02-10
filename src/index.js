const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const PORT = 9898;
const { createCampaign, checkUser, getCampaigns, createUser } = require("./utils/db.js");
let counts = 0;

let tokenCreation = (req, res, next) => {
	checkUser({
		name: req.body.user,
		password: req.body.pass,
	}).then((data) => {
		if (data.length > 0) {
			let token = jwt.sign(
				{ user: data[0]._id },
				process.env.TOKEN_SECRET,
				{ expiresIn: "15m" }
			);
			res.locals.token = token;
			next();
		} else {
			res.status(401).json({ error: "User not found" });
		}
	});

	// token needs exp time etc.
};

let tokenCheck = (req, res, next) => {
	let token = req.headers.authorization;
	token = token.split(" ");
	token = token[1];
	try {
		const check = jwt.verify(token, process.env.TOKEN_SECRET);
		res.locals.verify = true;
		res.locals.decoded = check;
	} catch (err) {
		res.locals.verify = false;
		res.locals.errorMessage = err.name;
		console.log("HURRA EIN FEHLER IST DA", err.name);
	}

	next();
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/", (req, res) => {
	res.end("Welcome");
});

app.post("/api/login", tokenCreation, (req, res) => {
	res.status(200).json({ token: res.locals.token });
});
app.post("/api/register", (req,res) => {
	let user = { name: req.body.user,
		password: req.body.pass,}
	console.log('Unser USer: ', user)
	createUser(user)
	res.status(200).end()
});
app.post("/api/createcampaign", tokenCheck, async (req, res) => {
	if (res.locals.verify) {
		let campaign = req.body;
		campaign.creator = res.locals.decoded.user;
		createCampaign(campaign);
		res.status(200).end();
	} else {
		res.status(401).json({
			verify: res.locals.verify,
			message: res.locals.errorMessage,
		});
	}
});

app.get("/api/campaigns", tokenCheck, async (req, res) => {
	if (res.locals.verify !== true) {
		res.status(401).json({
			verify: res.locals.verify,
			message: res.locals.errorMessage,
		});
	}
	getCampaigns(res.locals.decoded.user).then((campaings) =>
		res.status(200).json(campaings)
	);
});

app.get("/api/validate", tokenCheck, (req, res) => {
	console.log("Nach verify: ", res.locals.verify);
	res.status(res.locals.verify ? 200 : 401).json({
		verify: res.locals.verify,
	});
});
app.get("/counter", (req, res) => {
	counts++;

	res.status(200).json({ count: counts });
});
app.listen(PORT, () => {
	console.log("Server listen on port:", PORT);
});
