//import neccessary libraries and create variables
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const e = require("express");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userAuth = require("./routes/userAuth");
const questions = require("./routes/questions");
const userCabinet = require("./routes/userCabinet");

const { json } = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const PORT = 8888;
const url =
  "mongodb+srv://admin:3989302As@cluster0.o2m8r.mongodb.net/prof_orientation_test_db?retryWrites=true&w=majority";
const connectionOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const Schema = mongoose.Schema;

//create a server
app.listen(PORT, () => {
  console.log("Running Server On Port: " + PORT);
});


// and now You can use 2.x express dynamicHelpers
require('express-dynamic-helpers-patch')(app);

app.dynamicHelpers({
    loggedIn: function (req, res) {
      return req.session.loggedIn;
    }
 });

app.use(cookieParser());
app.use(session({secret: 'secret', resave: false, saveUninitialized: true}));

app.use("/", userAuth);
app.use("/questions", questions);
app.use("/profile/", userCabinet);


//connect pug files
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index");
});


