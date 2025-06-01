import { updateMailById } from "../../mails/mailsService.js";

export function patchMail(req, res) {
    const { id } = req.params;
    const { subject, body } = req.body;

    const result = updateMailById(id, subject, body);

    if (result === "not_found") {
        return res.status(404).json({ error: "Mail not found" });
    }

    if (result === "bad_request") {
        return res.status(400).json({ error: "Subject or body required for update" });
    }

    return res.status(204).end(); // No Content
}
