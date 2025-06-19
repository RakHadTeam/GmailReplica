import { addMailToLabel } from "../../../../models/label.model.js";

export async function postLabelMail(req, res) {
    const userId = req.userId;
    const { id: labelId } = req.params;
    const { mailId } = req.body;

    if (!mailId) {
        return res
            .status(400)
            .json({ error: "Missing required field: mailId" });
    }

    const { status, error } = addMailToLabel(userId, labelId, mailId);

    if (error) {
        return res
            .status(status ?? 400)
            .json({ error });
    }

    return res
        .status(status)
        .location(`/api/labels/${labelId}`)
        .json({ message: "Mail added to label successfully" });
}
