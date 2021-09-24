const mongoose = require("mongoose");
const express = require("express");
const url =
  "mongodb+srv://admin:3989302As@cluster0.o2m8r.mongodb.net/prof_orientation_test_db?retryWrites=true&w=majority";
const connectionOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

const register = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
    if (err) {
      res.json({
        error: err,
      });
    }
  });

  let user = new userSchema({
    name: req.body.name,
    email: req.body.email,
    password: hashedPass,
  });
};

router.get("/signup", (req, res) => {
  res.render("signup");
  var terms = document.getElementById("terms");
  var signBtn = document.getElementById("SignUp");
  if (terms) {
    signBtn.setAttribute("disabled", false);
  } else {
    signBtn.setAttribute("disabled", true);
  }
});

module.exports = router;
