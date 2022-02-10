//import neccessary libraries and create variables
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const e = require("express");
require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userAuth = require("./routes/userAuth");
const questions = require("./routes/questions");
const userCabinet = require("./routes/userCabinet");

const { json } = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const PORT = process.env.PORT;

// and now You can use 2.x express dynamicHelpers
require("express-dynamic-helpers-patch")(app);

app.dynamicHelpers({
	loggedIn: function (req, res) {
		return req.session.loggedIn;
	},
});

app.use(cookieParser());
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));

app.use("/", userAuth);
app.use("/questions", questions);
app.use("/profile/", userCabinet);

//connect pug files
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use("/css", express.static(path.join("node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join("node_modules/bootstrap/dist/js")));
app.use("/js", express.static(path.join("node_modules/jquery/dist")));

//create a server
app.listen(PORT, () => {
	console.log("Running Server On Port: " + PORT);
});

app.get("/", (req, res) => {
	res.render("index");
});
