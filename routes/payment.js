const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const pubKey = "pk_test_51JesNWBUY03f3NHYEzl45zGZ4i1cURY1SFYTFLEgSdGisQJMlGoua5MURdqypE7rPMYWA4XXYAakUdoYtCsdOZTX00s03q4I6b"; 
const secretKey = "sk_test_51JesNWBUY03f3NHYCaBX5qHwtSXKmHbcB2BkyTFFMNfs9m3qqRQzCzNMryIq6PulNvGMzw8eofXonurJ8Dpj3OgQ00zDXSAHom";


const url =
  "mongodb+srv://admin:3989302As@cluster0.o2m8r.mongodb.net/prof_orientation_test_db?retryWrites=true&w=majority";
const connectionOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const router = express.Router();


router.get("/", (req, res)=>{
    return res.render("payment", {key: pubKey});
})

module.exports = router;