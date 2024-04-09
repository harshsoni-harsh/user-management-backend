const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/users", authenticateToken, async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

router.post("/user", authenticateToken, async (req, res) => {
  const { userDetails } = req.body;
  if (userDetails) {
    let { name, role, email, password } = userDetails;
    if (name && email && password) {
      let userExists = await User.find({ email });
      if (userExists.length === 0) {
        let rep = await User.insertMany([{ name, role, email, password }]);
        console.log(rep);
      } else {
        res.status(409).send("A user already exists with the given mail-id. Please use a different mail-id");
      }
      res.status(200).send("User added successfully");
    } else {
      res
        .status(400)
        .send("Please enter name, email and password in userDetails");
    }
  } else {
    res
      .status(400)
      .send("Please enter user details to be created as userDetails");
  }
});

router.get("/user/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userDetails = await User.find({ _id: id });
  res.send(userDetails);
});

router.patch("/user/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userDetails } = req.body;
  if (!userDetails) {
    res.status(400).send("Please enter userDetails");
  } else {
    const { name, role, email, password } = userDetails;
    let user = await User.findOneAndUpdate(
      { _id: id },
      { name, role, email, password }
    );
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send("User details updated successfully");
    }
  }
});

router.delete("/user/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { deletedCount } = await User.deleteOne({ _id: id });
  if (deletedCount) {
    res.send("User deleted successfully");
  } else {
    res.status(404).send("User not found");
  }
});

module.exports = router;
