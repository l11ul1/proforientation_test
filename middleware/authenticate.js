const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("tokoookeeen: " + token);
    const decode = jwt.verify(token, 'secretValue');
    session = req.session
    session.loggedIn = "true";
    req.user = decode;
    next();
  } catch(err) {
    res.redirect("/login");
  }
}


module.exports = authenticate;
