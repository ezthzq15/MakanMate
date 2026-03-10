const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

router.get("/", async (req, res) => {
  try {

    const snapshot = await db.collection("foodStalls").get();

    const stalls = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(stalls);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

// test github