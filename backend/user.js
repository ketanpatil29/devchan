import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  githubId: String,
  username: String,
  avatar: String,
  followers: Number,
  following: Number,
  repos: Number,
  githubBio: String,

  interests: { type: Array, default: [] },
  lookingFor: { type: Array, default: [] },
  about: { type: String, default: "" },
  role: { type: String, default: "" },
  experience: { type: Number, default: 0 },
  languages: { type: Array, default: [] },
  profileCompleted: { type: Boolean, default: false },

  status: { type: String, default: "Available" },

  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  friendRequests: [
    {
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

});

const User = mongoose.model("User", UserSchema);

export default User;
