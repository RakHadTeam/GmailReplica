import { getLatestMails } from "./mailsService.js";

export function getMails(req, res) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { status, error, mails } = getLatestMails(token);
    if (error) {
        return res.status(status ?? 400).json({ error });
    }

    res.status(status).json(mails);
}
