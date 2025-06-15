import express from "express";
import apiRouter from "./routes/api.router.js";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.use("/api", apiRouter);

// Serve the react app
app.use(express.static("src/views/build"));

export default app;
