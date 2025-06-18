import express from "express";
import { getUserByIdHandler } from "../controllers/api/users/get.js";
import { patchUserByIdHandler } from "../controllers/api/users/patch.js";
import { upload } from "../controllers/api/users/post.js";

export const userRouter = express.Router();

userRouter.get("/", getUserByIdHandler);
userRouter.patch("/", upload.single("picture"), patchUserByIdHandler);
