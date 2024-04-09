/**
 * @swagger
 * paths:
 *   /users:
 *     get:
 *       summary: Fetches details of all users
 *       security:
 *         - bearerAuth: []
 *       tags: [User-api]
 *       responses:
 *         200:
 *           description: All users details
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/User'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *   /user:
 *     post:
 *       summary: Adds a new user
 *       security:
 *         - bearerAuth: []
 *       tags: [User-api]
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userDetails:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Name of the user
 *                     role:
 *                       type: string
 *                       description: Role of the user
 *                     email:
 *                       type: string
 *                       description: E-mail of the user
 *                     password:
 *                       type: string
 *                       description: Password of the user
 *       responses:
 *         201:
 *           description: User created successfully
 *         409:
 *           description: User already exists with the given mail-id.
 *         400:
 *           description: User details are missing
 */
/**
 * @swagger
 * paths:
 *   /user/{id}:
 *     get:
 *       summary: Fetches the user details with the given id
 *       security:
 *         - bearerAuth: []
 *       tags: [User-api]
 *       parameters:
 *         - name: id
 *           in: path
 *           description: User ID
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: User details
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         404:
 *           description: User not found
 *     patch:
 *       summary: Updates the user details with the given id
 *       security:
 *         - bearerAuth: []
 *       tags: [User-api]
 *       parameters:
 *         - name: id
 *           in: path
 *           description: User ID
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userDetails:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Name of the user
 *                     role:
 *                       type: string
 *                       description: Role of the user
 *                     email:
 *                       type: string
 *                       description: E-mail id of the user
 *                     password:
 *                       type: string
 *                       description: Password of the user
 *       responses:
 *         200:
 *           description: User details updated successfully
 *         400:
 *           description: User details were not entered
 *         404:
 *           description: User not found
 *     delete:
 *       summary: Deletes the user with the given id
 *       security:
 *         - bearerAuth: []
 *       tags: [User-api]
 *       parameters:
 *         - name: id
 *           in: path
 *           description: User ID
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         204:
 *           description: User deleted successfully
 *         404:
 *           description: User not found
 */

const express = require("express");
let bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user");
const authenticateToken = require("../middlewares/authMiddleware");

// GET
router.get("/users", authenticateToken, async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

// POST
router.post("/user", authenticateToken, async (req, res) => {
  const { userDetails } = req.body;
  if (userDetails) {
    let { name, role, email, password } = userDetails;
    if (name && email && password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      let userExists = await User.find({ email });
      if (userExists.length === 0) {
        let rep = await User.insertMany([
          { name, role, email, password: hashedPassword },
        ]);
      } else {
        res
          .status(409)
          .send(
            "A user already exists with the given mail-id. Please use a different mail-id"
          );
      }
      res.status(201).send("User added successfully");
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

// GET (by id)
router.get("/user/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const userDetails = await User.find({ _id: id });
    res.send(userDetails[0]);
  } catch {
    res.status(404).send("User not found");
  }
});

// PATCH (by id)
router.patch("/user/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userDetails } = req.body;
  if (!userDetails) {
    res.status(400).send("Please enter userDetails");
  } else {
    try {
      const { name, role, email, password } = userDetails;
      let hashedPassword;
      if (password) {
        hashedPassword = bcrypt.hash(password, 10);
      }
      let user = await User.findOneAndUpdate(
        { _id: id },
        { name, role, email, password: hashedPassword }
      );
      res.send("User details updated successfully");
    } catch {
      res.status(404).send("User not found");
    }
  }
});

// DELETE (by id)
router.delete("/user/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { deletedCount } = await User.deleteOne({ _id: id });
  if (deletedCount) {
    res.status(204).send("User deleted successfully");
  } else {
    res.status(404).send("User not found");
  }
});

module.exports = router;
