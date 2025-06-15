import { getMailById } from "../../../../models/mail.model.js";

export function getMailByIdHandler(req, res) {
    const { id } = req.params;

    const token = req.headers.authorization?.split(" ")[1];

    const { status, error, mail } = getMailById(token, id);

    if (error) {
        return res.status(status).json({ error });
    }

    res.status(status).json(mail);
}
