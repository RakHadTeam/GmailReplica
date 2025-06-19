import { deleteLabelById } from "../../../../models/label.model.js";

export function deleteLabel(req, res) {
        console.log(req.params);
    const { id } = req.params;

    const userId = req.userId;

    const { error, status } = deleteLabelById(userId, id);
    if (error) {
        return res.status(status).json({ error });
    }

    res.status(status).send();
}
