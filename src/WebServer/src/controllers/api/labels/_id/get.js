import { NotFoundError } from "../../../../core/errors/AppError.js";
import { getLabelById } from "../../../../services/label/getLabelById.js";

export async function getLabel(req, res) {
    const { id } = req.params; // Extracts the 'id' parameter from the URL
    const userId = req.userId;

    try {
        const label = await getLabelById(userId, id);
        res.status(200).json(label);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ error: error.message });
        } else {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
