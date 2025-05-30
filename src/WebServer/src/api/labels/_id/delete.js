import { deleteLabelById } from "../labelsService.js";

export function deleteLabel(req, res) {
    const { id } = req.params;

    deleteLabelById(id);

    res.status(204).send();
}
