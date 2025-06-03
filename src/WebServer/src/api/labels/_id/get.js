import { getLabelById } from "./labelService.js";

export function getLabel(req, res) {
    const { id } = req.params; // Extracts the 'id' parameter from the URL
    const token = req.headers.authorization?.split(" ")[1]; // Extracts the token from the Authorization header

    const { label, status, error } = getLabelById(token, id);

    if (error) {
        return res.status(status).json({ error });
    }

    // If found, return the label with status 200
    res.status(status).json(label);
}