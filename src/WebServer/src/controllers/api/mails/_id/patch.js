import { MailValidationError } from "../../../../core/errors/AppError.js";
import StatusCode from "../../../../core/StatusCode.js";
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

        return res.status(StatusCode.NO_CONTENT).location(`/api/mails/${id}`).send();
    } catch (err) {
        if (err instanceof MailValidationError)
            return res.status(StatusCode.BAD_REQUEST).json({ error: err.message });
        else {
            console.error("Error updating mail:", err);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }
}
