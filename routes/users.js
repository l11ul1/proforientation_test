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
const toastr = require("toastr");

toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: false,
  progressBar: true,
  positionClass: "toast-top-right",
  preventDuplicates: true,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

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

const User = mongoose.model("user", userSchema);

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/login", (req, res) => {
  res.render("login");
  toastr.info("tewst");
});

router.post("/signup", (req, res) => {
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user) {
      //TODO err hand
      toastr.warning("Email already exists");
    } else {
      let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            //TODO err
          }
          user.password = hash;
          user.save();
        });
      });
      console.log("Sucessfuly registered");
      res.render("login");
      toastr.success("You have created an account.");
    }
  });
});

module.exports = router;
