import { NotFoundError } from "../../../../core/errors/AppError.js";
import { deleteLabelById } from "../../../../services/label/deleteLabelById.js";

export async function deleteLabel(req, res) {
    const { id } = req.params;

    const userId = req.userId;

    try {
        await deleteLabelById(userId, id);
        return res.status(204).send();
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ error: error.message });
        } else {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
