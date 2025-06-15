import express from "express";
import { getUserByIdHandler } from "../controllers/api/users/get.js";
import { postUsers } from "../controllers/api/users/post.js";

export const usersRouter = express.Router();
usersRouter.post("/", postUsers);
usersRouter.get("/:id", getUserByIdHandler);
