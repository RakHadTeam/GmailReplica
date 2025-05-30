import { getLabelById } from "../labelsService.js";

export function getLabel(req, res) {
    const { id } = req.params; // Extracts the 'id' parameter from the URL
    const label = getLabelById(id);

    if (!label) {
        // If label not found, return 404 with error message
        return res.status(404).json({ error: "Label not found" });
    }

    // If found, return the label with status 200
    res.status(200).json(label);
}