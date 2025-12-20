import express from "express";
import User from "./user.js";

const router = express.Router();

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

export default router;