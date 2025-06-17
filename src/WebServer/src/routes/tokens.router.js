import express from "express";
import { postTokens } from "../controllers/api/tokens/post.js";
import { deleteTokens } from "../controllers/api/tokens/delete.js";

export const tokensRouter = express.Router();

tokensRouter.post("/", postTokens);
tokensRouter.delete("/", deleteTokens);
