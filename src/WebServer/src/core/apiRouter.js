import express from "express";
import { deleteLabel } from "../api/labels/_id/delete.js";
import { getLabel } from "../api/labels/_id/get.js";
import { patchLabel } from "../api/labels/_id/patch.js";
import { getLabels } from "../api/labels/get.js";
import { postLabels } from "../api/labels/post.js";
import { postUsers } from "../api/users/post.js";
import { getUserByIdHandler } from "../api/users/get.js";


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

export default apiRouter;
