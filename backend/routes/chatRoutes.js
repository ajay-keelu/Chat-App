const express = require("express");
const protect = require("../middlewareError/authMiddleware");
const {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeToGroup,
} = require("../Controller/chatController");
const router = express.Router();

router.route("/").post(protect, accessChat).get(protect, fetchChat);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/addmember").put(protect, addToGroup);
router.route("/removemember").put(protect, removeToGroup);
module.exports = router;
