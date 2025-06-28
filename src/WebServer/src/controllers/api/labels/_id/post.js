import { NotFoundError } from "../../../../core/errors/AppError.js";
import { addMailToLabel } from "../../../../services/label/addMailToLabel.js";

export async function postLabelMail(req, res) {
    const userId = req.userId;
    const { id: labelId } = req.params;
    const { mailId } = req.body;

    if (!mailId) {
        return res
            .status(400)
            .json({ error: "Missing required field: mailId" });
    }

    try {
        await addMailToLabel(userId, labelId, mailId);
        res.status(204).send();
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ error: error.message });
        } else {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
