const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, "ajay", {
    expiresIn: "10d",
  });
};

module.exports = generateToken;
