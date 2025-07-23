import { NotFoundError } from "../../../../../core/errors/AppError.js";
import StatusCode from "../../../../../core/StatusCode.js";
import { searchMails } from "../../../../../services/mail/searchMails.js";

export async function searchMailsHandler(req, res) {
    const query = req.params.query.toLowerCase();
    const userId = req.userId;

    try {
        const mails = await searchMails(userId, query);
        return res.status(StatusCode.OK).json(mails);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(StatusCode.NOT_FOUND).json({ error: error.message });
        }
        return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
}
