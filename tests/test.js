const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);
chai.should();

describe("User management API", function () {
  let user;

  // Unknown route
  describe("GET /random", () => {
    it("should return a status code 404 - Page not found", function (done) {
      chai
        .request(app)
        .get("/random")
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            res.should.have.status(404);
            res.text.should.be.equal("404 - Page Not Found");
            done();
          }
        });
    });
  });

  // Login route
  describe("POST /login", () => {
    // On providing correct credentials
    it("should return a status code 200 and jwtToken on successful login", function (done) {
      chai
        .request(app)
        .post("/login")
        .send({ email: "admin@gmail.com", password: "admin" })
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            res.should.have.status(200);
            res.body.should.have.property("jwtToken");
            done();
          }
        });
    });

    // on providing wrong credentials
    it("should return a status code 401 and 'Invalid credentials' message on wrong credentials", function (done) {
      chai
        .request(app)
        .post("/login")
        .send({ email: "random@gmail.com", password: "admin" })
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            res.should.have.status(401);
            res.text.should.be.equal("Invalid credentials");
            done();
          }
        });
    });
  });

  // Fetch all users
  describe("GET /users", () => {
    // With correct JWT Token
    it("should return a status code 200 and details of all users", async function () {
      try {
        const res = await chai
          .request(app)
          .get("/users")
          .set(
            "Authorization",
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbmVAeHl6LmNvbSIsImlhdCI6MTcxMjY2OTY5OH0._shATjZ7MTAvB2qWIOUhpkHEyFSz2lPQrCdbp8azcPY"
          );
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.be.an("array");
        user = res.body[0];
      } catch (err) {
        throw err;
      }
    });

    // Without JWT Token
    it("should return a status code 401 and an error message, if invalid JWT token is provided", function (done) {
      chai
        .request(app)
        .get("/users")
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            res.should.have.status(401);
            res.text.should.be.a("string");
            done();
          }
        });
    });
  });

  // Create new user
  describe("POST /user", () => {
    // When providing new user details
    it("should return a status code 201 and a success message", function (done) {
      chai
        .request(app)
        .post("/user")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbmVAeHl6LmNvbSIsImlhdCI6MTcxMjY2OTY5OH0._shATjZ7MTAvB2qWIOUhpkHEyFSz2lPQrCdbp8azcPY"
        )
        .send({
          userDetails: {
            name: "person",
            email: "person@alphabet.com",
            password: "person",
          },
        })
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            res.should.have.status(201);
            res.text.should.be.a("string");
            done();
          }
        });
    });

    // When providing existing user details
    it("should return a status code 409 and an error message, if user already exists", function (done) {
      chai
        .request(app)
        .post("/user")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbmVAeHl6LmNvbSIsImlhdCI6MTcxMjY2OTY5OH0._shATjZ7MTAvB2qWIOUhpkHEyFSz2lPQrCdbp8azcPY"
        )
        .send({
          userDetails: {
            name: "person",
            email: "person@alphabet.com",
            password: "person",
          },
        })
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            res.should.have.status(409);
            res.text.should.be.a("string");
            done();
          }
        });
    });

    // When not providing user details
    it("should return a status code 400 and an error message, if user details aren't provided", function (done) {
      chai
        .request(app)
        .post("/user")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbmVAeHl6LmNvbSIsImlhdCI6MTcxMjY2OTY5OH0._shATjZ7MTAvB2qWIOUhpkHEyFSz2lPQrCdbp8azcPY"
        )
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            res.should.have.status(400);
            res.text.should.be.a("string");
            done();
          }
        });
    });
  });

  // Fetch user details
  describe("GET /user/{id}", () => {
    // Fetch details for correct id
    it("should return a status code 200 and the user details", function (done) {
      chai
        .request(app)
        .get(`/user/${user._id}`)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbmVAeHl6LmNvbSIsImlhdCI6MTcxMjY2OTY5OH0._shATjZ7MTAvB2qWIOUhpkHEyFSz2lPQrCdbp8azcPY"
        )
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            res.should.have.status(200);
            res.body.should.be.a("object");
            done();
          }
        });
    });

    // Fetch details for incorrect id
    it("should return a status code 404 and an error message, if incorrect user id is provided", function (done) {
      chai
        .request(app)
        .get(`/user/random`)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbmVAeHl6LmNvbSIsImlhdCI6MTcxMjY2OTY5OH0._shATjZ7MTAvB2qWIOUhpkHEyFSz2lPQrCdbp8azcPY"
        )
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            res.should.have.status(404);
            res.text.should.be.a("string");
            done();
          }
        });
    });
  });

  // Update user details
  describe("PATCH /user/{id}", () => {
    // Update details for correct user id
    it("should return a status code 200 and a success message", function (done) {
      chai
        .request(app)
        .patch(`/user/${user._id}`)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbmVAeHl6LmNvbSIsImlhdCI6MTcxMjY2OTY5OH0._shATjZ7MTAvB2qWIOUhpkHEyFSz2lPQrCdbp8azcPY"
        )
        .send({
          userDetails: {
            name: "TestPerson",
          },
        })
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            res.should.have.status(200);
            res.text.should.be.a("string");
            done();
          }
        });
    });

    // Update details without userDetails
    it("should return a status code 400 and an error message, if user details aren't provided", function (done) {
      chai
        .request(app)
        .patch(`/user/${user._id}`)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbmVAeHl6LmNvbSIsImlhdCI6MTcxMjY2OTY5OH0._shATjZ7MTAvB2qWIOUhpkHEyFSz2lPQrCdbp8azcPY"
        )
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            res.should.have.status(400);
            res.text.should.be.a("string");
            done();
          }
        });
    });

    // Update details for incorrect user id
    it("should return a status code 404 and an error message, if incorrect user id is provided", function (done) {
      chai
        .request(app)
        .patch(`/user/random`)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbmVAeHl6LmNvbSIsImlhdCI6MTcxMjY2OTY5OH0._shATjZ7MTAvB2qWIOUhpkHEyFSz2lPQrCdbp8azcPY"
        )
        .send({
          userDetails: {
            name: "TestPerson",
          },
        })
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            res.should.have.status(404);
            res.text.should.be.a("string");
            done();
          }
        });
    });
  });

  // Delete user
  describe("DELETE /user/{id}", () => {
    // Delete existing user
    it("should return a status code 204 and a success message", function (done) {
      chai
        .request(app)
        .delete(`/user/${user._id}`)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbmVAeHl6LmNvbSIsImlhdCI6MTcxMjY2OTY5OH0._shATjZ7MTAvB2qWIOUhpkHEyFSz2lPQrCdbp8azcPY"
        )
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            res.should.have.status(204);
            res.text.should.be.a("string");
            done();
          }
        });
    });

    // Delete non-existing user
    it("should return a status code 404 and an error message, if user doesn't exist", function (done) {
      chai
        .request(app)
        .get(`/user/random`)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbmVAeHl6LmNvbSIsImlhdCI6MTcxMjY2OTY5OH0._shATjZ7MTAvB2qWIOUhpkHEyFSz2lPQrCdbp8azcPY"
        )
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            res.should.have.status(404);
            res.text.should.be.a("string");
            done();
          }
        });
    });
  });
});
