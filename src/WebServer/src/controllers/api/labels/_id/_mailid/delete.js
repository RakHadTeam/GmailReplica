import {
    NotFoundError,
    UnauthorizedError,
} from "../../../../../core/errors/AppError.js";
import { removeMailFromLabelById } from "../../../../../services/label/removeMailFromLabelById.js";

export async function deleteLabelMailAttachment(req, res) {
    const userId = req.userId;
    const { id: labelId, mailId } = req.params;

    if (!mailId) {
        return res
            .status(400)
            .json({ error: "Missing required URL param: mailId" });
    }

    try {
        await removeMailFromLabelById(userId, labelId, mailId);
        res.status(204).send();
    } catch (error) {
        if (error instanceof NotFoundError)
            return res.status(404).json({ error: error.message });

        if (error instanceof UnauthorizedError) {
            return res.status(403).json({ error: error.message });
        } else {
            console.error("Error removing mail from label:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
