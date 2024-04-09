const express = require("express");

const userRoutes = require("./routes/userRoutes");
const loginRoute = require("./routes/loginRoute");
const swaggerDocs = require("./config/swagger");
const connectDB = require("./config/dbConnect");

const app = express();
app.use(express.json());

app.use(loginRoute);
app.use(userRoutes);

connectDB()
  .then(() => {
    try {
      app.listen(3000, () => {
        swaggerDocs(app);
        console.log(`Server listening at http://localhost:3000`);
        app.use((req, res) => {
          res.status(404).send("404 - Page Not Found");
        });
      });
    } catch (e) {
      console.log("Error:", e);
    }
  })
  .catch(() => {
    console.log("Invalid database credentials");
  });
