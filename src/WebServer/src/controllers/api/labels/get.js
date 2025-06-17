import { getAllLabels } from "../../../models/labels.model.js";

export function getLabels(req, res) {
    const userId = req.userId;

    const { status, labels, error } = getAllLabels(userId);

    if (error) {
        return res.status(status ?? 400).json({ error });
    }

    res.status(status).json(labels);
}

