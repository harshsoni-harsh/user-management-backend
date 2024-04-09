const mongoose = require("mongoose");

module.exports = async () => {
  const uri = process.env.MONGODB_URI;
  await mongoose
    .connect(uri)
    .then(() => {
      console.log("Connected to database successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};
