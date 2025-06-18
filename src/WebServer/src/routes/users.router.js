import express from "express";
import { postUsers, upload } from "../controllers/api/users/post.js";
import { userRouter } from "./user.router.js";

export const usersRouter = express.Router({ mergeParams: true });

usersRouter.post("/", upload.single("picture"), postUsers);
usersRouter.use("/:id", requireAuth, userRouter);
