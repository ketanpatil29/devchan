import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";

import passport from "passport";
import authRoutes from "./auth.js";

import githubUserRoutes from "./githubUser.js";
import friendReqRoutes from "./friendReq.js";

const server = express();

server.use(cors({
    origin: process.env.FRONTEND_URL,
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
server.use("/user", friendReqRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {console.log("MongoDb connected")})
    .catch(() => {console.log("MongoDB connection failed...")});

server.get("/", (req, res) => {
    res.send("Server listening...")
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
