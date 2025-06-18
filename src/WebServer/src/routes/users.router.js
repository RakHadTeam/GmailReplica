import express from "express";
import { getUserByIdHandler } from "../controllers/api/users/get.js";
import { postUsers, upload } from "../controllers/api/users/post.js";
import { patchUserByIdHandler } from "../controllers/api/users/patch.js";

export const usersRouter = express.Router();

usersRouter.post("/", upload.single("picture"), postUsers);
usersRouter.get("/:id", getUserByIdHandler);
usersRouter.patch("/:id", upload.single("picture"), patchUserByIdHandler);
