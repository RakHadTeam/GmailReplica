import { updateMailById } from "./mailService.js";

export function patchMail(req, res) {
    const { id } = req.params;
    const { subject, body, recipient, draft } = req.body;

    const token = req.headers.authorization?.split(" ")[1];

    const { status, error } = updateMailById(token, id, {
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
