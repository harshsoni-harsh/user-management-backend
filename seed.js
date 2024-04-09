const mongoose = require("mongoose");
const User = require("./models/user");
const dbConnect = require("./config/dbConnect");
const bcrypt = require("bcrypt");

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

async function hashPasswords() {
  const hashedUserData = await Promise.all(
    seedUsers.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    }))
  );
  return hashedUserData;
}

const seedDB = async () => {
  const updatedUserDetails = await hashPasswords();
  await User.deleteMany({});
  await User.insertMany(updatedUserDetails);
  console.log("Data seeded successfully");
};

seedDB().then(() => {
  mongoose.connection.close();
});
