import express from "express";

const server = express();

server.get("/", (req, res) => {
    res.send("Server listening...")
})

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
})