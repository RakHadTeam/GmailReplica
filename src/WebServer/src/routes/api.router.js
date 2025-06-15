import express from "express";
import { blacklistRouter } from "./blacklist.router.js";
import { mailsRouter } from "./mails.router.js";
import { tokensRouter } from "./tokens.router.js";
import { usersRouter } from "./users.router.js";
import { labelsRouter } from "./labels.router.js";
import meRouter from "./me.router.js";

export const apiRouter = express.Router();

apiRouter.use("/tokens", tokensRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/labels", labelsRouter);
apiRouter.use("/mails", mailsRouter);
apiRouter.use("/blacklist", blacklistRouter);
apiRouter.use("/me", meRouter);

export default apiRouter;
