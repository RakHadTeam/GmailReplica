import express from "express";
import { getLabels } from "../controllers/api/labels/get.js";
import { postLabels } from "../controllers/api/labels/post.js";
import { getLabel } from "../controllers/api/labels/_id/get.js";
import { patchLabel } from "../controllers/api/labels/_id/patch.js";
import { deleteLabel } from "../controllers/api/labels/_id/delete.js";
import { postLabelMail } from "../controllers/api/labels/_id/post.js";
import { deleteLabelMailAttachment } from "../controllers/api/labels/_id/_mailid/delete.js";

export const labelsRouter = express.Router();

labelsRouter.get("/", getLabels);
labelsRouter.post("/", postLabels);

const labelIdRouter = express.Router({ mergeParams: true });

labelIdRouter.get("/", getLabel);
labelIdRouter.post("/", postLabelMail);
labelIdRouter.patch("/", patchLabel);
labelIdRouter.delete("/", deleteLabel);

const mailLabelRouter = express.Router({ mergeParams: true });
mailLabelRouter.delete("/", deleteLabelMailAttachment);

labelIdRouter.use("/:mailId", mailLabelRouter)

labelsRouter.use("/:id", labelIdRouter);
