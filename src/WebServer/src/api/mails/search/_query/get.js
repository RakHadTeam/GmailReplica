import { searchMails } from "../searchService.js";

export function searchMailsHandler(req, res) {
    const query = req.params.query.toLowerCase();
    const token = req.headers.authorization?.split(" ")[1];

    const results = searchMails(token, query);

    if (results.status) {
        return res.status(results.status).end();
    }
    res.status(200).json(results);
}
