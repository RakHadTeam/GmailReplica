import { NotFoundError } from "../../../../core/errors/AppError.js";
import StatusCode from "../../../../core/StatusCode.js";
import { deleteMailById } from "../../../../services/mail/deleteMailById.js";

export async function deleteMail(req, res) {
    const { id } = req.params;

    const userId = req.userId;

    try {
        await deleteMailById(userId, id);
        return res.status(StatusCode.NO_CONTENT).end();
    } catch (err) {
        if (err instanceof NotFoundError) {
            return res.status(StatusCode.NOT_FOUND).json({ error: err.message });
        } else {
            console.error("Error deleting mail:", err);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }
}
