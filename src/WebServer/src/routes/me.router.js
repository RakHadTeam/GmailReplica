import express from "express";
import { getMe } from "../controllers/api/me/get.js";

export const meRouter = express.Router();

meRouter.get("/", getMe);

