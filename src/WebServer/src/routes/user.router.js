import express from "express";
import { getUserByIdHandler } from "../controllers/api/users/get.js";
import { patchUserByIdHandler } from "../controllers/api/users/patch.js";

export const userRouter = express.Router();

userRouter.get("/", getUserByIdHandler);
userRouter.patch("/", upload.single("picture"), patchUserByIdHandler);
