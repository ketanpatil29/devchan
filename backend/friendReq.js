import express from "express";
import User from "./user.js";

router.post("/connect", async (req, res) => {
  const { fromUsername, toUsername } = req.body;

  const fromUser = await User.findOne({ username: fromUsername });

  const toUser = await User.findOne({ username: toUsername });

  if(!fromUser || !toUser)
  {
    return res.status(400).json({ message: "User not found..." });
  }

  const alreadySent = toUser.friendRequests.some(
    req => res.from.toString() === fromUser._id.toString()
  );

  if(alreadySent)
  {
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

    // Add each other as friends
    toUser.friends.push(fromUser._id);
    fromUser.friends.push(toUser._id);

    await toUser.save();
    await fromUser.save();

    res.json({ success: true, message: "Friend request accepted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;