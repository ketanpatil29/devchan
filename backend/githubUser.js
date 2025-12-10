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

router.get("/match/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ message: "User not found" });

    const matches = await User.find({
      username: { $ne: username },
      profileCompleted: true,
      status: "Available",
      $or: [
        { role: user.role },
        ...(user.languages.length > 0 ? [{ languages: { $in: user.languages } }] : []),
        ...(user.interests.length > 0 ? [{ interests: { $in: user.interests } }] : [])
      ]
    });



    res.json({ success: true, matches });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Match fetch failed" });
  }
});

export default router;
