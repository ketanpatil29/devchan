import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  githubId: String,
  username: String,
  avatar: String,
  followers: Number,
  following: Number,
  repos: Number,
  githubBio: String,

  // NEW FIELDS
  interests: { type: Array, default: [] },
  lookingFor: { type: Array, default: [] },
  role: { type: String, default: "" },
  experience: { type: Number, default: 0 },
  languages: { type: Array, default: [] },
  profileCompleted: { type: Boolean, default: false },
});

const User = mongoose.model("User", UserSchema);

export default User;