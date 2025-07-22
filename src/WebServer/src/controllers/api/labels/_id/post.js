import { NotFoundError } from "../../../../core/errors/AppError.js";
import StatusCode from "../../../../core/StatusCode.js";
import { addMailToLabel } from "../../../../services/label/addMailToLabel.js";

export async function postLabelMail(req, res) {
    const userId = req.userId;
    const { id: labelId } = req.params;
    const { mailId } = req.body;

    if (!mailId) {
        return res
            .status(StatusCode.BAD_REQUEST)
            .json({ error: "Missing required field: mailId" });
    }

    try {
        await addMailToLabel(userId, labelId, mailId);
        res.status(204).send();
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(StatusCode.NOT_FOUND).json({ error: error.message });
        } else {
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }
}
