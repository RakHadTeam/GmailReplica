import cookieParser from "cookie-parser";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import apiRouter from "./routes/api.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.resolve(__dirname, "../uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

const app = express();

app.use("/uploads", express.static(UPLOAD_DIR));

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cookieParser());

app.use("/api", apiRouter);

// Serve the react app
app.use(express.static(path.resolve(__dirname, "../src/views/build")));

app.get(/(.*)/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "../src/views/build/index.html"));
});

export default app;
