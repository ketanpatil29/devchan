import express from "express";
import User from "./user.js";

const router = express.Router();

// Return user info by GitHub username
router.get("/me/:username", async (req, res) => {
  try {
    const username = req.params.username;
    let user = await User.findOne({ username })
      .populate("friends", "username avatar")
      .populate("friendRequests.from", "username avatar");

    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ REMOVE null friends and duplicates
    user.friends = user.friends
      .filter((v, i, a) => v && a.findIndex(f => f._id.toString() === v._id.toString()) === i);

    // ✅ REMOVE null friendRequests
    user.friendRequests = user.friendRequests
      .filter(req => req.from != null);

    return res.json(user);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/match/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const matches = await User.find({
      username: { $ne: username },
      profileCompleted: true,
      status: "Available",
      $or: [
        { role: user.role },
        { languages: { $in: user.languages.length ? user.languages : [""] } },
        { interests: { $in: user.interests.length ? user.interests : [""] } }
      ]
    });

    if (!matches.length) {
      return res.json({ noMoreMatches: true });
    }

    // ✅ PICK RANDOM MATCH
    const randomIndex = Math.floor(Math.random() * matches.length);
    const match = matches[randomIndex];

    // ✅ CHECK IF ALREADY FRIENDS
    const isFriend = user.friends.some(
      id => id.toString() === match._id.toString()
    );

    // ✅ CHECK IF REQUEST ALREADY SENT
    const requestSent = match.friendRequests.some(
      req => req.from.toString() === user._id.toString()
    );

    // ✅ CHECK IF ALREADY LIKED (ANYTIME IN PAST)
    const alreadyLiked = user.likesSent.some(
      id => id.toString() === match._id.toString()
    );

    // ✅ SEND SINGLE RESPONSE
    return res.json({
      _id: match._id,
      username: match.username,
      avatar: match.avatar,
      githubBio: match.githubBio,
      languages: match.languages,
      about: match.about,
      role: match.role,
      experience: match.experience,
      interests: match.interests,
      isFriend,
      requestSent,
      alreadyLiked
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Match fetch failed" });
  }
});


export default router;
