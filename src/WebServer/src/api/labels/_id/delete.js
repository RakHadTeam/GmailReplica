import { deleteLabelById } from "./labelService.js";

export function deleteLabel(req, res) {
    const { id } = req.params;

    const token = req.headers.authorization?.split(" ")[1];

    const { error, status } = deleteLabelById(token, id);
    if (error) {
        return res.status(status).json({ error });
    }

    res.status(status).send();
}
