import {
    NotFoundError,
    UnauthorizedError,
} from "../../../../../core/errors/AppError.js";
import StatusCode from "../../../../../core/StatusCode.js";
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
        res.status(StatusCode.NO_CONTENT).send();
    } catch (error) {
        if (error instanceof NotFoundError)
            return res.status(StatusCode.NOT_FOUND).json({ error: error.message });

        if (error instanceof UnauthorizedError) {
            return res.status(StatusCode.UNAUTHORIZED).json({ error: error.message });
        } else {
            console.error("Error removing mail from label:", error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }
}
