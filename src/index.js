const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const PORT = 9898;
const createCampaign = require("./utils/db.js");
let counts = 0;

let tokenCreation = (req, res, next) => {
	let token = jwt.sign({ foo: "bar" }, "secret");
	console.log(token);
	next();
};

let tokenCheck = (req, res, next) => {
	// token aus dem request fischen
	// token veryfien
	next();
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/", (req, res) => {
	res.end("Welcome");
});

app.post("/api/login", tokenCreation, (req, res) => {
	console.log("Login");
	res.status(200).end();
});
app.post("/api/createcampaign", tokenCheck, async (req, res) => {
	console.log(req.body.campaign);
	createCampaign(req.body);
	res.status(200).end();
});

app.get("/counter", (req, res) => {
	console.log("anfrage");
	counts++;

	res.status(200).json({ count: counts });
});
app.listen(PORT, () => {
	console.log("Server listen on port:", PORT);
});
