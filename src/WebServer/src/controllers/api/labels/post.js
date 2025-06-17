import { createLabel } from "../../../models/labels.model.js";


export function postLabels(req, res) {
    const userId = req.userId;

    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }

    let newLabel = {
        name
    };

    const { status, label } = createLabel(userId, newLabel)

    res.status(status).location(`/api/labels/${label.id}`).send();
}
