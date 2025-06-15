import { searchMails } from "../../../../../models/search.model.js";

export function searchMailsHandler(req, res) {
    const query = req.params.query.toLowerCase();
    const token = req.headers.authorization?.split(" ")[1];

    const { status, error, mails } = searchMails(token, query);

    if (error) {
        return res.status(status).json({ error });
    }
    res.status(200).json(mails);
}
