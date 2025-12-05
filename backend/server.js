import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import session from "express-session";

import passport from "passport";
import authRoutes from "./auth.js";

const server = express();

server.use(
    session({
        secret: "devchan-secret",
        resave: false,
        saveUninitialized: false,
    })
)

server.use(passport.initialize());
server.use(passport.session());

server.use("/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {console.log("MongoDb connected")})
    .catch(() => {console.log("MongoDB connection failed...")});

server.get("/", (req, res) => {
    res.send("Server listening...")
})

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
})