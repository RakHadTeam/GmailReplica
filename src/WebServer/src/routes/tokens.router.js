import express from "express";
import { postTokens } from "../controllers/api/tokens/post.js";

export const tokensRouter = express.Router();
tokensRouter.post("/", postTokens);
