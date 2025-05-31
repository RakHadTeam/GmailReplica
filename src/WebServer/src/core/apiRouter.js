import express from "express";
import globals from "../core/globals.js";
import { postTokens } from "../api/tokens/post.js";
import { deleteLabel } from "../api/labels/_id/delete.js";
import { getLabel } from "../api/labels/_id/get.js";
import { patchLabel } from "../api/labels/_id/patch.js";
import { getLabels } from "../api/labels/get.js";
import { postLabels } from "../api/labels/post.js";
import { postUsers } from "../api/users/post.js";
import { getUserByIdHandler } from "../api/users/get.js";
import { postBlacklist } from "../api/blacklist/post.js";
import { deleteBlacklistID } from "../api/blacklist/_id/delete.js";

const apiRouter = express.Router();

const labelsRouter = express.Router();
labelsRouter.get("/", getLabels);
labelsRouter.post("/", postLabels);

const labelIdRouter = express.Router({ mergeParams: true });
labelIdRouter.get("/", getLabel);
labelIdRouter.patch("/", patchLabel);
labelIdRouter.delete("/", deleteLabel);
labelsRouter.use("/:id", labelIdRouter);

apiRouter.use("/labels", labelsRouter);

const usersRouter = express.Router();
usersRouter.post("/", postUsers);
usersRouter.get("/:id", getUserByIdHandler);


apiRouter.use("/users", usersRouter);

apiRouter.post("/tokens", postTokens);

const blacklistRouter = express.Router();
blacklistRouter.post("/", postBlacklist);

const blacklistIdRouter = express.Router({ mergeParams: true });
blacklistIdRouter.delete("/", deleteBlacklistID);
blacklistRouter.use("/:id", blacklistIdRouter);

apiRouter.use("/blacklist", blacklistRouter);


export default apiRouter;
