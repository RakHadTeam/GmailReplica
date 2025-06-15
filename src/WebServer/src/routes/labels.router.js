import express from "express";
import { deleteLabel } from "../controllers/api/labels/_id/delete.js";
import { getLabel } from "../controllers/api/labels/_id/get.js";
import { patchLabel } from "../controllers/api/labels/_id/patch.js";
import { getLabels } from "../controllers/api/labels/get.js";
import { postLabels } from "../controllers/api/labels/post.js";

export const labelsRouter = express.Router();
labelsRouter.get("/", getLabels);
labelsRouter.post("/", postLabels);
const labelIdRouter = express.Router({ mergeParams: true });
labelIdRouter.get("/", getLabel);
labelIdRouter.patch("/", patchLabel);
labelIdRouter.delete("/", deleteLabel);
labelsRouter.use("/:id", labelIdRouter);

