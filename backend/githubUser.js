import express from "express";
import User from "./user.js";

const router = express.Router();

// Return user info by GitHub username
router.get("/me/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
