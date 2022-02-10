const mongoose = require("mongoose");
const express = require("express");
const url =
	"mongodb+srv://admin:3989302As@cluster0.o2m8r.mongodb.net/prof_orientation_test_db?retryWrites=true&w=majority";
const connectionOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");
const { json } = require("body-parser");

const pubKey =
	"pk_test_51JesNWBUY03f3NHYEzl45zGZ4i1cURY1SFYTFLEgSdGisQJMlGoua5MURdqypE7rPMYWA4XXYAakUdoYtCsdOZTX00s03q4I6b";
const secretKey =
	"sk_test_51JesNWBUY03f3NHYCaBX5qHwtSXKmHbcB2BkyTFFMNfs9m3qqRQzCzNMryIq6PulNvGMzw8eofXonurJ8Dpj3OgQ00zDXSAHom";

const stripe = require("stripe")(secretKey);

const toastr = require("toastr");

mongoose
	.connect(url, connectionOptions)
	.then(() => {
		console.log("Users connected successfully");
	})
	.catch((err) => {
		console.log(`Users failed to connect with a ${err}`);
	});

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		name: {
			type: String,
		},
		email: {
			type: String,
		},
		password: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

const ResultScheema = new Schema({
	user_id: String,
	results: Object,
});

const User = mongoose.model("user", userSchema);
const Result = mongoose.model("result", ResultScheema);

router.get("/signup", (req, res) => {
	res.render("signup");
});

router.get("/logout", (req, res) => {
	res.clearCookie("token");
	req.session.destroy();
	res.redirect("/");
});

router.get("/login", (req, res) => {
	const token = req.cookies.token;
	console.log(token);
	if (token) {
		const decode = jwt.verify(token, "secretValue");
		if (decode) {
			res.redirect("/profile");
		} else {
			res.render("login");
		}
	} else {
		res.clearCookie("token");
		res.render("login");
	}
});

router.post("/login", (req, res) => {
	var username = req.body.username;
	var password = req.body.password;

	User.findOne({
		email: username,
	}).then((user) => {
		if (user) {
			bcrypt.compare(password, user.password, function (err, result) {
				if (err) {
					console.log("//TODO err hand");
					res.render("login", { err: "Упс что-то пошло не так" });
				}
				if (result) {
					const token = jwt.sign(
						{ user_id: user._id, name: user.name },
						"secretValue",
						{
							expiresIn: "2h",
						}
					);
					session = req.session;
					session.loggedIn = "true";
					res.cookie("token", token);
					res.redirect("/profile");
					console.log("Successfully logged in");
				} else {
					console.log("//TODO err hand Password doesnt match");
					res.render("login", { err: "Неправильный пароль" });
				}
			});
		} else {
			console.log("//TODO err hand No user found");
			res.render("login", { err: "Аккаунт не существует" });
		}
	});
});

router.get("/test", authenticate, (req, res) => {
	res.render("test");
});

router.get("/profile", authenticate, (req, res) => {
	console.log(req.user);
	let lastResult;
	let query = Result.find({ user_id: req.user.user_id });

	query
		.exec()
		.then((results) => {
			lastResult = results[results.length - 1].results;
			res.render("profile", {
				results: lastResult,
				key: pubKey,
				name: req.user.name,
			});
		})
		.catch(function (err) {
			lastResult = 0;
			res.render("profile", {
				results: lastResult,
				key: pubKey,
				name: req.user.name,
			});
		});
});

router.post("/profile/payment", authenticate, (req, res) => {
	stripe.customers
		.create({
			email: req.body.stripeEmail,
			source: req.body.stripeToken,
		})
		.then((customer) => {
			return stripe.charges.create({
				amount: 100000,
				description: "description",
				currency: "KZT",
				customer: customer.id,
			});
		})
		.then((charge) => {
			console.log("Success charged");
			session = req.session;
			session.paidToken = charge.id;
			res.redirect("/questions");
		})
		.catch((err) => {
			res.send(err);
		});
});

router.post("/signup", (req, res) => {
	User.findOne({
		email: req.body.email,
	}).then((user) => {
		if (user) {
			//TODO err hand
			console.log("email exists");
		} else {
			let user = new User({
				name: req.body.name,
				email: req.body.email,
				password: req.body.password,
			});

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(user.password, salt, (err, hash) => {
					if (err) {
						//TODO err
					}
					user.password = hash;
					user.save();
				});
			});
			console.log("Sucessfuly registered");
			res.redirect("/profile");
		}
	});
});

module.exports = router;
