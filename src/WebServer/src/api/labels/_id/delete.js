import { deleteLabelById } from "./labelService.js";

export function deleteLabel(req, res) {
    const { id } = req.params;

    const token = req.headers.authorization?.split(" ")[1];

    const status = deleteLabelById(token, id);
    if (status) {
        return res.status(status).end();
    }

    res.status(204).send();
}
