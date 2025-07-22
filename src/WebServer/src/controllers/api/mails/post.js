import { NotFoundError } from "../../../core/errors/AppError.js";
import StatusCode from "../../../core/StatusCode.js";
import { createMail } from "../../../services/mail/createMail.js";

export async function postMail(req, res) {
    const userId = req.userId;
    const { subject, body, recipient, draft = false } = req.body;

    if (!draft) {
        if (!subject || !body || !recipient) {
            return res.status(StatusCode.BAD_REQUEST).json({ error: "Missing required fields" });
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
            .status(StatusCode.CREATED)
            .location(`/api/mails/${mail.id}`)
            .json({
                message: draft
                    ? "Draft saved successfully"
                    : "Mail sent successfully",
                id: mail.id,
            });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(StatusCode.NOT_FOUND).json({ error: error.message });
        } else {
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }
}
