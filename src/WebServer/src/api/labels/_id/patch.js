import { getLabelById } from "../labelsService.js";

export function patchLabel(req, res) {
    const { id } = req.params; // Gets the ID from the URL
    const { name } = req.body; // Gets the new name from the request body
    // Validate that 'name' is present
    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }
    // Find the label by ID
    const label = getLabelById(id);
    if (!label) {
        // If label not found, return 404
        return res.status(404).json({ error: "Label not found" });
    }
    // Update the label name
    label.name = name;
    res.status(204).send(); // Respond with HTTP 204 No Content
}
