const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const db = require("../config/firebase");

// Protected route to fetch the authenticated user's profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    // req.user.uid is attached by verifyToken middleware
    const uid = req.user.uid;

    // Fetch user document from Firestore
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User profile not found in database" });
    }

    // Return the profile data
    res.status(200).json({
      message: "Profile fetched successfully",
      profile: userDoc.data()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
