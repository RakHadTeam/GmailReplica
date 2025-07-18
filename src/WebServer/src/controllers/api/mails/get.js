import { NotFoundError } from "../../../core/errors/AppError.js";
import { getLatestMails } from "../../../services/mail/getLatestMails.js";

export async function getMails(req, res) {
    const userId = req.userId;

    try {
        const mails = await getLatestMails(userId);
        return res.status(200).json(mails);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
}
