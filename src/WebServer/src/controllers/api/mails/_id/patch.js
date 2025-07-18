import { MailValidationError } from "../../../../core/errors/AppError.js";
import { updateMailById } from "../../../../services/mail/updateMailById.js";

export async function patchMail(req, res) {
    const { id } = req.params; //get the mail ID from the request parameters
    const { subject, body, recipient, draft } = req.body;

    const userId = req.userId;

    try {
        await updateMailById(userId, id, {
            subject,
            body,
            recipient,
            draft,
        });

        return res.status(204).location(`/api/mails/${id}`).send();
    } catch (err) {
        if (err instanceof MailValidationError)
            return res.status(400).json({ error: err.message });
        else {
            console.error("Error updating mail:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
