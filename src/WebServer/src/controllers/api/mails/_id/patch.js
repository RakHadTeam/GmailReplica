import { updateMailById } from "../../../../models/mail.model.js";

export function patchMail(req, res) {
    const { id } = req.params;
    const { subject, body, recipient, draft } = req.body;

    const userId = req.userId;

    const { status, error } = updateMailById(userId, id, {
        subject,
        body,
        recipient,
        draft,
    });

    if (error) {
        return res.status(status ?? 400).json({ error });
    }

    return res.status(status).location(`/api/mails/${id}`).send();
}
