const User = require("../models/user");
const jwt = require("jsonwebtoken");

async function authenticateToken(req, res, next) {
  let jwtToken;
  let authHeader = req.get("authorization");
  if (authHeader) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (!jwtToken) {
    res.status(401).send("Invalid JWT Token");
  } else {
    const { email } = jwt.verify(jwtToken, process.env.JWTSECRET);
    let user = await User.find({ email });
    let userExists = user.length === 1;
    if (userExists) {
      next();
    } else {
      res.status(401).send("User not authorized");
    }
  }
}

module.exports = authenticateToken;
