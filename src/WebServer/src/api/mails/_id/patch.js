import globals from "../../../core/globals.js";

export function patchMail(req, res) {
    const { id } = req.params;
    const { subject, body } = req.body;

    if (!subject && !body) {
        return res.status(400).json({ error: "Subject or body required for update" });
    }

    const mail = globals.mails.find(m => m.id === id);

    if (!mail) {
        return res.status(404).json({ error: "Mail not found" });
    }

    if (subject) mail.subject = subject;
    if (body) mail.body = body;

    return res.status(204).send(); // No Content
}
