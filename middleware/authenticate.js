const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.cookie.split(';')[0].replace('token=','');
    const decode = jwt.verify(token, 'secretValue');

    req.user = decode;
    next();
  } catch(err) {
    res.send("auth failed");
  }
}


module.exports = authenticate;
