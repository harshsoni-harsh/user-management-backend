const mongoose = require("mongoose");
require("dotenv").config({path: '.env.local'});

module.exports = async () => {
  const uri = process.env.MONGODB_URI;
  await mongoose
    .connect(uri)
    .then(() => {
      console.log("Connected to database successfully");
    })
    .catch((err) => {
      throw new Error(err);
    });
};
