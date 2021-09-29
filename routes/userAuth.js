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

const pubKey = "pk_test_51JesNWBUY03f3NHYEzl45zGZ4i1cURY1SFYTFLEgSdGisQJMlGoua5MURdqypE7rPMYWA4XXYAakUdoYtCsdOZTX00s03q4I6b"; 
const secretKey = "sk_test_51JesNWBUY03f3NHYCaBX5qHwtSXKmHbcB2BkyTFFMNfs9m3qqRQzCzNMryIq6PulNvGMzw8eofXonurJ8Dpj3OgQ00zDXSAHom";

const stripe = require('stripe')(secretKey)

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

router.get("/logout", (req, res) => {
  res.clearCookie('token');
  res.redirect('/')
});

router.get("/login", authenticate, (req, res) => {
  if(req.headers.cookie) {
    res.redirect("/profile");
  } else {
    res.render("login");
  }
});


router.get("/profile/", authenticate, (req, res)=>{
  console.log(req.body);
  return res.render("profile", {key: pubKey});
});

router.post("/profile/", authenticate, (req, res) => {
stripe.customers.create({
  email: req.body.stripeEmail,
  source: req.body.stripeToken,
  name: 'Admin',
  address: {
    line1: 'address',
    postal_code: 'pc',
    city: 'city',
    state: 'state',
    country: 'country'
  }
}).then((customer) => {
    return stripe.charges.create({
      amount: 100000,
      description: 'description',
      currency: 'KZT',
      customer: customer.id
    })
}).then((charge) => {
  console.log("Success charged");
  console.log(charge);
  res.send(charge)
}).catch((err) => {
  res.send(err);
})
})

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
        }
        if (result) {
          const token = jwt.sign({ user_id: user.name }, "secretValue", {
            expiresIn: "10s",
          });
          res.setHeader("Set-Cookie", `token=${token}`);
          res.redirect("/profile");
          
          console.log("Successfully logged in");
        } else {
          console.log("//TODO err hand Password doesnt match");
        }
      });
    } else {
      console.log("//TODO err hand No user found");
    }
  });

  // try {
  //   // Get user input
  //   var username = req.body.username;
  //   var password = req.body.password;
  //   // Validate user input
  //   if (!(username && password)) {
  //     res.status(400).send("All input is required");
  //   }
  //   // Validate if user exist in our database
  //   const user = await User.findOne({ email: username });

  //   if (user && (await bcrypt.compare(password, user.password))) {
  //     // Create token
  //     const token = jwt.sign({ user_id: user.id, username }, "secretValue", {
  //       expiresIn: "2h",
  //     });
    
  //     //res.redirect("/user/cabinet/welcome");
  //     res.send(token);
  //   }
  //   res.status(400).send("Invalid Credentials");
  // } catch (err) {
  //   console.log(err);
  // }
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
      res.redirect('/login');
    }
  });
});

module.exports = router;
