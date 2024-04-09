const mongoose = require("mongoose");
const User = require("./models/user");
const dbConnect = require("./config/dbConnect");

dbConnect();

const seedUsers = [
  {
    name: "Admin",
    role: "Management",
    email: "admin@gmail.com",
    password: "admin",
  },
  {
    name: "Lorem Ipsum",
    role: "Management",
    email: "lorem@xyz.com",
    password: "default",
  },
  {
    name: "Jane Doe",
    role: "Admin",
    email: "jane@xyz.com",
    password: "default",
  },
  {
    name: "John Doe",
    email: "John@abc.com",
    password: "default",
  },
  {
    name: "Bookworm",
    role: "CEO",
    email: "worm@google.com",
    password: "default",
  },
];

const seedDB = async () => {
  await User.deleteMany({});
  await User.insertMany(seedUsers);
  console.log("Data seeded successfully");
};

seedDB().then(() => {
  mongoose.connection.close();
});
