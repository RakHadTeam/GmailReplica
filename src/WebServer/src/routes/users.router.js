import express from "express";
import { getUserByIdHandler } from "../controllers/api/users/get.js";
import { postUsers, upload } from "../controllers/api/users/post.js";

export const usersRouter = express.Router();
usersRouter.post("/", upload.single("picture"), postUsers);
usersRouter.get("/:id", getUserByIdHandler);
