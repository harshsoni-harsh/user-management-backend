const mongoose = require("mongoose");
const User = require("./models/user");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database connection was successful");
  })
  .catch((err) => {
    console.log(err);
  });

const seedUsers = [
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
