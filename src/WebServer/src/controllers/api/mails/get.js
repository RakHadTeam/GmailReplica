import { getLatestMails } from "../../../services/mail/getLatestMails.js";

export async function getMails(req, res) {
    const userId = req.userId;

    try {
        const mails = await getLatestMails(userId);
        return res.status(200).json(mails);
    } catch (error) {
        console.error("Error fetching mails:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
