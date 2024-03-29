const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, "ajay");
      req.user = await User.findOne({ _id: decoded.id }).select("-password");
      next();
    } catch (err) {
      res.status(401);
      throw new Error("No Authorization");
    }
  }
});

module.exports = protect;
