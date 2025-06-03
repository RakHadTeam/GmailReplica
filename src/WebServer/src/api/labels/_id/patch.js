import { updateLabel } from "./labelService.js";

export function patchLabel(req, res) {
    const { id } = req.params; // Gets the ID from the URL
    const { name } = req.body; // Gets the new name from the request body

    const token = req.headers.authorization?.split(" ")[1]; // Extracts the token from the Authorization header
    if (!name) {
        return res.status(400).json({ error: "Name is required" }); // Returns an error if name is not provided
    }

    const {status, error} = updateLabel(token, id, { name }); // Calls the service to update the label
    if (error) {
        return res.status(status).json({ error });
    }

    return res.status(status).location(`/api/labels/${id}`).send(); // If successful, return the status and location
}
