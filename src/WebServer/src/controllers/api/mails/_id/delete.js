import { deleteMailById } from "../../../../models/mail.model.js";

export function deleteMail(req, res) {
    const { id } = req.params;

    const userId = req.userId;

    const { status, error } = deleteMailById(userId, id);

    if (error) {
        return res.status(status).json({ error });
    }

    return res.status(status).end();
}
