const express = require("express");
const { registerUser, loginUser } = require("../Controllers/authController");

const router = express.Router();

// Signup route
router.post("/signup", registerUser);
router.post("/login", loginUser);

module.exports = router;
