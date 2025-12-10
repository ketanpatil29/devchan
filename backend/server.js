import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";

import passport from "passport";
import authRoutes from "./auth.js";

import githubUserRoutes from "./githubUser.js";

const server = express();

server.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));

server.use(express.json());

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
server.use("/user", githubUserRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {console.log("MongoDb connected")})
    .catch(() => {console.log("MongoDB connection failed...")});

server.get("/", (req, res) => {
    res.send("Server listening...")
})

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
})