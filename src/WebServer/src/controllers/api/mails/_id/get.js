import { getMailById } from "../../../../models/mail.model.js";

export function getMailByIdHandler(req, res) {
    const { id } = req.params;

    const userId = req.userId;

    const { status, error, mail } = getMailById(userId, id);

    if (error) {
        return res.status(status).json({ error });
    }

    res.status(status).json(mail);
}
