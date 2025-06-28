import { NotFoundError } from "../../../../core/errors/AppError.js";
import { updateLabelById } from "../../../../services/label/updateLabelById.js";

export async function patchLabel(req, res) {
    const { id } = req.params; // Gets the ID from the URL
    const { name } = req.body; // Gets the new name from the request body

    const userId = req.userId;
    if (!name) {
        return res.status(400).json({ error: "Name is required" }); // Returns an error if name is not provided
    }

    try {
        await updateLabelById(userId, id, { name });
        return res.status(204).location(`/api/labels/${id}`).send();
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ error: error.message });
        } else {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
