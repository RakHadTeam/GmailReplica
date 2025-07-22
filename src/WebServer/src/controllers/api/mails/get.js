import { NotFoundError } from "../../../core/errors/AppError.js";
import StatusCode from "../../../core/StatusCode.js";
import { getLatestMails } from "../../../services/mail/getLatestMails.js";

export async function getMails(req, res) {
    const userId = req.userId;

    try {
        const mails = await getLatestMails(userId);
        return res.status(StatusCode.OK).json(mails);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(StatusCode.NOT_FOUND).json({ error: error.message });
        }
        return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
}
