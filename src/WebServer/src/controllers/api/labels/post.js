import { createLabel } from "../../../models/labels.model.js";


export function postLabels(req, res) {
    const userId = req.userId;

    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }

    let newLabel = {
        name,
        mails:[],
    };

    const { status, label, error } = createLabel(userId, newLabel)

    if (error) {
        return res.status(status ?? 400).json({ error });
    }

    res.status(status).location(`/api/labels/${label.id}`).json({ id: label.id })
}
