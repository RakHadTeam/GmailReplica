import { updateMailById } from "../../mails/mailsService.js";

export function patchMail(req, res) {
    const { id } = req.params;
    const { subject, body } = req.body;

    if (typeof subject !== "string" && typeof body !== "string") {
        return res.status(400).json({ error: "Subject or body required for update" });
    }

    const updated = updateMailById(id, { subject, body });

    if (!updated) {
        return res.status(404).json({ error: "Mail not found" });
    }

    return res.status(204).end(); // No Content
}
