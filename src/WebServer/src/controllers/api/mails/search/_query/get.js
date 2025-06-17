import { searchMails } from "../../../../../models/search.model.js";

export function searchMailsHandler(req, res) {
    const query = req.params.query.toLowerCase();
    const userId = req.userId;

    const { status, error, mails } = searchMails(userId, query);

    if (error) {
        return res.status(status).json({ error });
    }
    res.status(200).json(mails);
}
