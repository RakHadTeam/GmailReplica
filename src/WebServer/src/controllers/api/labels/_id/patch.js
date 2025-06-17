import { updateLabel } from "../../../../models/label.model.js";

export function patchLabel(req, res) {
    const { id } = req.params; // Gets the ID from the URL
    const { name } = req.body; // Gets the new name from the request body

    const userId = req.userId;
    if (!name) {
        return res.status(400).json({ error: "Name is required" }); // Returns an error if name is not provided
    }

    const {status, error} = updateLabel(userId, id, { name }); // Calls the service to update the label
    if (error) {
        return res.status(status).json({ error });
    }

    return res.status(status).location(`/api/labels/${id}`).send(); // If successful, return the status and location
}
