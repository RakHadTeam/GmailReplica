import { getLatestMails } from "../../../models/mails.model.js";

export function getMails(req, res) {
    const userId = req.userId;

    const { status, error, mails } = getLatestMails(userId);
    if (error) {
        return res.status(status ?? 400).json({ error });
    }

    res.status(status).json(mails);
}
