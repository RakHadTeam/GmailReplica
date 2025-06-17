import express from "express";
import apiRouter from "./routes/api.router.js";
import cookieParser from "cookie-parser";
import fs from "fs";

const UPLOAD_DIR = "uploads";

// delete the upload directory if it exists
if (fs.existsSync(UPLOAD_DIR)) {
    fs.rmSync(UPLOAD_DIR, { recursive: true, force: true });
}

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cookieParser());

app.use("/api", apiRouter);

// Serve the react app
app.use(express.static("src/views/build"));

export default app;
