import express from "express";
import { blacklistRouter } from "./blacklist.router.js";
import { mailsRouter } from "./mails.router.js";
import { tokensRouter } from "./tokens.router.js";
import { usersRouter } from "./users.router.js";
import { labelsRouter } from "./labels.router.js";
import meRouter from "./me.router.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const apiRouter = express.Router();

apiRouter.use("/tokens", tokensRouter); 
apiRouter.use("/users", requireAuth, usersRouter); 
apiRouter.use("/labels", requireAuth, labelsRouter);
apiRouter.use("/mails", requireAuth, mailsRouter);
apiRouter.use("/blacklist", requireAuth, blacklistRouter);
apiRouter.use("/me", requireAuth, meRouter);


export default apiRouter;
