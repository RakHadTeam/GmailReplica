import { searchMails } from "../../mailsService.js";

export function searchMailsHandler(req, res) {
    const query = req.params.query.toLowerCase();
    const results = searchMails(query);
    res.status(200).json(results);
}
