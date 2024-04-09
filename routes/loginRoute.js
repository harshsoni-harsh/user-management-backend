/**
 * @swagger
 * components:
 *     securitySchemes:
 *         bearerAuth:
 *             type: http
 *             scheme: bearer
 *             bearerFormat: JWT
 *     responses:
 *         UnauthorizedError:
 *             description: JWT token is missing or invalid
 *     schemas:
 *         User:
 *             type: object
 *             required:
 *                 - name
 *                 - email
 *                 - password
 *             properties:
 *                 _id:
 *                     type: string
 *                     description: Auto generated id of User
 *                 name:
 *                     type: string
 *                     description: Name of the user
 *                 role:
 *                     type: string
 *                     description: Role of the user
 *                 email:
 *                     type: string
 *                     description: E-mail of the user
 *                 password:
 *                     type: string
 *                     description: Password of the user
 */
/**
 * @swagger
 * tags:
 *     name: User-api
 *     description: User management API
 * /login:
 *     post:
 *         summary: Logs in the user to get JWT token
 *         tags: [User-api]
 *         requestBody:
 *             description: Login Credentials
 *             required: true
 *             content:
 *                 application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             email:
 *                                 type: string
 *                             password:
 *                                 type: string
 *                     example:
 *                         email: "jane@xyz.com"
 *                         password: "default"
 *         responses:
 *             200:
 *                 description: The JWT Token
 *                 content:
 *                     application/json:
 *                         schema:
 *                             type: object
 *                             properties:
 *                                 jwtToken:
 *                                     type: string
 *                                     description: JWT Token, that'll be used to perform management operations
 *             401:
 *                 description: Authentication Error - Invalid Credentials
 */

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

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
