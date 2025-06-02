import { getLabelById } from "./labelService";

export function getLabel(req, res) {
    const { id } = req.params; // Extracts the 'id' parameter from the URL
    const token = req.headers.authorization?.split(" ")[1]; // Extracts the token from the Authorization header
    
    const label = getLabelById(token, id);

    if (label.status) {
        return res.status(label.status).end();
    }

    // If found, return the label with status 200
    res.status(200).json(label);
}