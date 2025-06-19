import express from "express";
import { deleteMail } from "../controllers/api/mails/_id/delete.js";
import { getMailByIdHandler } from "../controllers/api/mails/_id/get.js";
import { patchMail } from "../controllers/api/mails/_id/patch.js";
import { getMails } from "../controllers/api/mails/get.js";
import { postMail } from "../controllers/api/mails/post.js";
import { searchMailsHandler } from "../controllers/api/mails/search/_query/get.js";


export const mailsRouter = express.Router();

mailsRouter.get("/", getMails);
mailsRouter.post("/", postMail);
mailsRouter.get("/search/:query", searchMailsHandler);

const mailIdRouter = express.Router({ mergeParams: true });
mailIdRouter.get("/", getMailByIdHandler);
mailIdRouter.patch("/", patchMail);

mailIdRouter.delete("/", deleteMail);

mailsRouter.use("/:id", mailIdRouter);
