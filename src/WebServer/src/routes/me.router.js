import express from "express";
import { getMe } from "../controllers/api/me/get.js";

const meRouter = express.Router();
meRouter.get("/", getMe);

export default meRouter;
