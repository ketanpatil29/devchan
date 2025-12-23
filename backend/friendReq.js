import express from "express";
import User from "./user.js";

const router = express.Router();

router.post("/like", async (req, res) => {
  try {
    const { fromUsername, toUsername } = req.body;

    if (fromUsername === toUsername) {
      return res.status(400).json({ message: "Cannot like yourself" });
    }

    const fromUser = await User.findOne({ username: fromUsername });
    const toUser = await User.findOne({ username: toUsername });

    if (!fromUser || !toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent duplicate like
    if (fromUser.likesSent.includes(toUser._id)) {
      return res.status(400).json({ message: "Already liked" });
    }

    // Save like
    fromUser.likesSent.push(toUser._id);
    toUser.likesReceived.push(fromUser._id);

    // 🔁 CHECK MATCH
    const isMatch = toUser.likesSent.includes(fromUser._id);

    if (isMatch) {
      // Add to matches
      fromUser.matches.push(toUser._id);
      toUser.matches.push(fromUser._id);

      // Notifications for BOTH
      fromUser.notifications.push({
        type: "MATCH",
        from: toUser._id,
        message: `You matched with ${toUser.username}`,
      });

      toUser.notifications.push({
        type: "MATCH",
        from: fromUser._id,
        message: `You matched with ${fromUser.username}`,
      });
    } else {
      // Like notification only
      toUser.notifications.push({
        type: "LIKE",
        from: fromUser._id,
        message: `${fromUser.username} liked your profile`,
      });
    }

    await fromUser.save();
    await toUser.save();

    res.json({
      success: true,
      isMatch,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/connect", async (req, res) => {
  console.log("CONNECT BODY:", req.body);

  const { fromUsername, toUsername } = req.body;

  const fromUser = await User.findOne({ username: fromUsername });

  const toUser = await User.findOne({ username: toUsername });

  if (!fromUser || !toUser) {
    return res.status(400).json({ message: "User not found..." });
  }

  if (toUser.friends.includes(fromUser._id)) {
    return res.status(400).json({ message: "You are already friends." });
  }

  const alreadySent = toUser.friendRequests.some(
    req => req.from.toString() === fromUser._id.toString()
  );

  if (alreadySent) {
    return res.status(400).json({ message: "Request is already sent." });
  }

  toUser.friendRequests.push({ from: fromUser._id });

  await toUser.save();

  res.json({ success: true, message: "Request sent" });
});

router.post("/accept", async (req, res) => {
  try {
    const { fromUserId, toUserId } = req.body;

    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);

    if (!fromUser || !toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove request
    toUser.friendRequests = toUser.friendRequests.filter(
      req => req.from.toString() !== fromUserId
    );

    // Add each other as friends if not already
    if (!toUser.friends.includes(fromUser._id)) {
      toUser.friends.push(fromUser._id);
    }

    if (!fromUser.friends.includes(toUser._id)) {
      fromUser.friends.push(toUser._id);
    }

    await toUser.save();
    await fromUser.save();

    res.json({ success: true, message: "Friend request accepted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/notifications/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate("notifications.from", "username avatar");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;