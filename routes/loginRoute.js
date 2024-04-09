const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require('../models/user')

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await User.find({ email, password });
  let userExists = user.length === 1;
  if (userExists) {
    let jwtToken = jwt.sign({ email }, process.env.JWTSECRET);
    res.send({ jwtToken });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

module.exports = router;
