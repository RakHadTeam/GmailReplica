import express from "express";
import apiRouter from "./routes/api.router.js";
import cookieParser from "cookie-parser";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cookieParser());

app.use("/api", apiRouter);

// Serve the react app
app.use(express.static("src/views/build"));

export default app;
