import { getLatestMails } from "./mailsService.js";

export function getMails(req, res) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const mails = getLatestMails(token);
    if (mails.status) {
        return res.status(mails.status).end();
    }
    res.status(200).json(mails);
}
