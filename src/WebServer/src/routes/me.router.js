import express from "express";
import { getMe } from "../controllers/api/me/get.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const meRouter = express.Router();

meRouter.get("/", requireAuth, getMe);

export default meRouter;
