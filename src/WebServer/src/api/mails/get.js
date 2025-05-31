import { getLatestMails } from "./mailsService.js";

export function getMails(req, res) {
    const mails = getLatestMails();
    res.status(200).json(mails);
}
