//import neccessary libraries and create variables
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const e = require("express");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const users = require("./routes/users");
const questions = require("./routes/questions");
const { json } = require("express");
const toastr = require("toastr");

const PORT = 8888;
const url =
  "mongodb+srv://admin:3989302As@cluster0.o2m8r.mongodb.net/prof_orientation_test_db?retryWrites=true&w=majority";
const connectionOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const Schema = mongoose.Schema;

//create a server
app.listen(PORT, () => {
  console.log("Running Server On Port: " + PORT);
});

app.use("/user", users);
app.use("/questions", questions);

//connect pug files
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index");
});
