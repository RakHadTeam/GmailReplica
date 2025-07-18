import { addURLToBlacklist } from "../../../services/blacklist/addURLToBlacklist.js";

export async function postBlacklist(req, res) {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        const status = await addURLToBlacklist(url);
        return res.status(status).location(`/api/blacklist/${url}`).json();
    } catch (error) {
        console.error("Error adding URL to blacklist:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
