import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    githubId: String,
    username: String,
    avatar: String,
    followers: Number,
    following: Number,
    repos: Number,
    githubBio: String,

    customBio: String,
    status: { type: String, default: "Available" },
    profileCompleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;