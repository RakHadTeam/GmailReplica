import express from "express";
import apiRouter from "./routes/api.router.js";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.use("/api", apiRouter);

export default app;
