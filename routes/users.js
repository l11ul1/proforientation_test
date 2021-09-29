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
});

router.post("/login", async (req, res) => {
  // var username = req.body.username;
  // var password = req.body.password;

  // User.findOne({
  //   email: username,
  // }).then((user) => {
  //   if (user) {
  //     bcrypt.compare(password, user.password, function (err, result) {
  //       if (err) {
  //         console.log("//TODO err hand");
  //       }
  //       if (result) {
  //         const token = jwt.sign({ user_id: user.name }, "secretValue", {
  //           expiresIn: "3h",
  //         });
  //         user.token = token;
  //         res.redirect("/");
  //         console.log("Successfully logged in");
  //       } else {
  //         console.log("//TODO err hand Password doesnt match");
  //       }
  //     });
  //   } else {
  //     console.log("//TODO err hand No user found");
  //   }
  // });

  try {
    // Get user input
    var username = req.body.username;
    var password = req.body.password;
    // Validate user input
    if (!(username && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email: username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign({ user_id: user.id, username }, "secretValue", {
        expiresIn: "2h",
      });
    
      
      req.body.token = token;
      res.redirect("/user/cabinet/welcome");
      
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

router.post("/signup", async (req, res) => {
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
      res.render("login");
    }
  });
});

module.exports = router;
