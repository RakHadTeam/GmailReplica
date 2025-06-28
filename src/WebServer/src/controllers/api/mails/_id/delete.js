import { NotFoundError } from "../../../../core/errors/AppError.js";
import { deleteMailById } from "../../../../services/mail/deleteMailById.js";

export async function deleteMail(req, res) {
    const { id } = req.params;

    const userId = req.userId;

    try {
        await deleteMailById(userId, id);
        return res.status(204).end();
    } catch (err) {
        if (err instanceof NotFoundError) {
            return res.status(404).json({ error: err.message });
        } else {
            console.error("Error deleting mail:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
