import express from 'express';
import apiRouter from './core/apiRouter.js';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.use("/api", apiRouter);

export default app;