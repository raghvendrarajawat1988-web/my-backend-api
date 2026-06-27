const express = require("express");
const router = express.Router();
const { getDB } = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

// ये route सिर्फ valid token वाले ही access कर सकते हैं
router.get("/users", verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const users = await db.collection("users").find({}).toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "कुछ गलत हो गया" });
  }
});

module.exports = router;