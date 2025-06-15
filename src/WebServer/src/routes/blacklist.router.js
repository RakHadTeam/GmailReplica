import express from "express";
import { deleteBlacklistID } from "../controllers/api/blacklist/_id/delete.js";
import { postBlacklist } from "../controllers/api/blacklist/post.js";

export const blacklistRouter = express.Router();
blacklistRouter.post("/", postBlacklist);
const blacklistIdRouter = express.Router({ mergeParams: true });
blacklistIdRouter.delete("/", deleteBlacklistID);
blacklistRouter.use("/:id", blacklistIdRouter);
