const mongoose = require("mongoose");
const express = require("express");

const connectionOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authenticate = require("../middleware/authenticate");
const { userAuth } = require("./userAuth");

mongoose
	.connect(process.env.DATABASE, connectionOptions)
	.then(() => {
		console.log("Users connected successfully");
	})
	.catch((err) => {
		console.log(`Users failed to connect with a ${err}`);
	});

router.get("/welcome", authenticate, (req, res) => {
	res.render("userCabinet");
});

module.exports = router;
