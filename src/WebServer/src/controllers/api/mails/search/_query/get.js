import { searchMails } from "../../../../../services/mail/searchMails.js";

export async function searchMailsHandler(req, res) {
    const query = req.params.query.toLowerCase();
    const userId = req.userId;

    try {
        const mails = await searchMails(userId, query);
        return res.status(200).json(mails);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ error: error.message });
        }
        console.error("Error searching mails:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
