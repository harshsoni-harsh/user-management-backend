const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "User management API",
      version: "1.0.0",
      contact: {
        name: "Harsh Soni",
        email: "harsh7428@protonmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const docs = swaggerJsdoc(options);

function swaggerDocs(app) {
  app.use("/docs", swaggerUI.serve, swaggerUI.setup(docs));
}

module.exports = swaggerDocs;
