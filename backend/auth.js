import dotenv from "dotenv";
dotenv.config();

import express from "express";
import passport from "passport";
import GitHubStrategy from "passport-github2";
import axios from "axios";
import User from "./user.js";

const router = express.Router();

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL}/auth/github/callback`
        },
        async function (accessToken, refreshToken, profile, done)
        {
            try {
        // Fetch full GitHub profile via GitHub API
        const gh = await axios.get("https://api.github.com/user", {
          headers: {
            Authorization: `token ${accessToken}`
          }
        });

        const data = gh.data;

        // 🔥 Save or update user in MongoDB
        let user = await User.findOne({ githubId: data.id });

        if (!user) {
          user = await User.create({
            githubId: data.id,
            username: data.login,
            avatar: data.avatar_url,
            followers: data.followers,
            following: data.following,
            repos: data.public_repos,
            githubBio: data.bio
          });
        } else {
          // Update latest GitHub data
          user.username = data.login;
          user.avatar = data.avatar_url;
          user.followers = data.followers;
          user.following = data.following;
          user.repos = data.public_repos;
          user.githubBio = data.bio;
          await user.save();
        }

        console.log(`🔥 User saved: ${user.username}`);

        return done(null, { user, accessToken });
      } catch (err) {
        console.error("GitHub login error:", err);
        return done(err, null);
      }
    
        }
    )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {

    console.log("🚨 FRONTEND_URL USED =", process.env.FRONTEND_URL);

    const username = req.user.user.username;

    res.redirect(
      `${process.env.FRONTEND_URL}/dashboard?token=${req.user.accessToken}&username=${username}`
    );
  }
);

router.get(
    "/logout",
    (req, res) => {
      const username = req.user?.user?.username;

      req.logout(function (err){
        if(err) {
          console.log("Logout error: ", err);
          return res.status(500).json({ message: "Logout failed"});
        }

        req.session.destroy(() => {
          res.clearCookie("connect.sid");
          console.log(`${username} logged out successfully`);
          return res.json({message: `${username} logged out successfully`});
        });
      });
    }
);

router.patch("/user/update/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const updatedUser = await User.findOneAndUpdate(
      { username },
      {
        interests: req.body.interests,
        lookingFor: req.body.lookingFor,
        role: req.body.role,
        experience: req.body.experience,
        languages: req.body.languages,
        profileCompleted: true
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, message: "Profile updated!", user: updatedUser });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

export default router;