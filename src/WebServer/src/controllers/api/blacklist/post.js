import { addURLToBlacklist } from "../../../models/blacklist.model.js";

export async function postBlacklist(req, res) {
    const { url } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    const status = await addURLToBlacklist(url);
    return res.status(status).location(`/api/blacklist/${url}`).json();
}
