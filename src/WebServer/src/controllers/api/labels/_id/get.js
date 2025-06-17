import { getLabelById } from "../../../../models/label.model.js";

export function getLabel(req, res) {
    const { id } = req.params; // Extracts the 'id' parameter from the URL
    const userId = req.userId;

    const { label, status, error } = getLabelById(userId, id);

    if (error) {
        return res.status(status).json({ error });
    }

    // If found, return the label with status 200
    res.status(status).json(label);
}