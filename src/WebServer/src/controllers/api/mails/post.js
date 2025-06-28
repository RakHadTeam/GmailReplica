import { NotFoundError } from "../../../core/errors/AppError.js";
import { createMail } from "../../../services/mail/createMail.js";

export async function postMail(req, res) {
    const userId = req.userId;
    const { subject, body, recipient, draft = false } = req.body;

    if (!draft) {
        if (!subject || !body || !recipient) {
            return res.status(400).json({ error: "Missing required fields" });
        }
    }

    const mailData = {
        subject: subject ?? "",
        body: body ?? "",
        draft,
        ...(!draft && { recipient }),
    };

    try {
        const mail = await createMail(userId, mailData);
        return res
            .status(201)
            .location(`/api/mails/${mail.id}`)
            .json({
                message: draft
                    ? "Draft saved successfully"
                    : "Mail sent successfully",
                id: mail.id,
            });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ error: error.message });
        } else {
            console.error("Error creating mail:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
