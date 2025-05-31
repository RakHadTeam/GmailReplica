import { addURLToBlacklist } from "./blacklistService.js";

export async function postBlacklist(req, res) {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    const status = await addURLToBlacklist(url);
    return res.status(status).json();
}
