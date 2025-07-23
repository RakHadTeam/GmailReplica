import { NotFoundError } from "../../../../core/errors/AppError.js";
import StatusCode from "../../../../core/StatusCode.js";
import { deleteLabelById } from "../../../../services/label/deleteLabelById.js";

export async function deleteLabel(req, res) {
    const { id } = req.params;

    const userId = req.userId;

    try {
        await deleteLabelById(userId, id);
        return res.status(StatusCode.NO_CONTENT).send();
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(StatusCode.NOT_FOUND).json({ error: error.message });
        } else {
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }
}
