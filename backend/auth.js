import dotenv from "dotenv";
dotenv.config();

import express from "express";
import passport from "passport";
import GitHubStrategy from "passport-github2";

const router = express.Router();

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/github/callback"
        },
        function (accessToken, refreshToken, profile, done)
        {
            console.log(`GitHub user connected: ${profile.username}`);
            return done(null, { profile, accessToken });
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
        const username = req.user.profile.username;
        res.redirect(`http://localhost:5173/dashboard?token=${req.user.accessToken}&username=${username}`);
    }
);

export default router;