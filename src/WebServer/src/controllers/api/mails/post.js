import { createMail } from "../../../models/mails.model.js";

export async function postMail(req, res) {
    const userId = req.userId;
    const { subject, body, recipient, draft } = req.body;

    if (!subject || !body || !recipient) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const { status, error, id } = await createMail(userId, {
        subject,
        body,
        recipient,
        draft,
    });

    if (error) {
        return res.status(status ?? 400).json({ error });
    }

    return res
        .status(status)
        .location(`/api/mails/${id}`)
        .json({ message: `${draft ? "Draft" : "Mail"} created successfully` });
}
