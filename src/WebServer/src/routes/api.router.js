import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { blacklistRouter } from "./blacklist.router.js";
import { labelsRouter } from "./labels.router.js";
import { mailsRouter } from "./mails.router.js";
import { meRouter } from "./me.router.js";
import { tokensRouter } from "./tokens.router.js";
import { usersRouter } from "./users.router.js";

import bodyParser from "body-parser";
import cors from "cors";

export const apiRouter = express.Router();

apiRouter.use(cors());
apiRouter.use(bodyParser.urlencoded({ extended: true }));
apiRouter.use(express.json());

apiRouter.use("/tokens", tokensRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/labels", requireAuth, labelsRouter);
apiRouter.use("/mails", requireAuth, mailsRouter);
apiRouter.use("/blacklist", requireAuth, blacklistRouter);
apiRouter.use("/me", requireAuth, meRouter);

export default apiRouter;
