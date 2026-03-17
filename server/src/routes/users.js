const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");

// Example of a protected route using authMiddleware
router.get("/me", verifyToken, async (req, res) => {
  try {
    // req.user is populated by the authMiddleware containing UID and email
    res.status(200).json({
      message: "You have accessed a protected route!",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
