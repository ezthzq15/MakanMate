const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/userController");
const { verifyToken } = require("../middlewares/auth");

// Protected route to fetch the authenticated user's profile
router.get("/profile", verifyToken, getProfile);

module.exports = router;
