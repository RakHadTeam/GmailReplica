import { deleteMailById } from "../../../../models/mail.model.js";

export function deleteMail(req, res) {
    const { id } = req.params;

    const token = req.headers.authorization?.split(" ")[1];

    const { status, error } = deleteMailById(token, id);

    if (error) {
        return res.status(status).json({ error });
    }

    return res.status(status).end();
}
