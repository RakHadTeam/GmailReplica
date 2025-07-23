import StatusCode from "../../../core/StatusCode.js";
import { addURLToBlacklist } from "../../../services/blacklist/addURLToBlacklist.js";

export async function postBlacklist(req, res) {
    const { url } = req.body;

    if (!url) {
        return res.status(StatusCode.BAD_REQUEST).json({ error: "URL is required" });
    }

    try {
        const status = await addURLToBlacklist(url);
        return res.status(status).location(`/api/blacklist/${url}`).json();
    } catch (error) {
        console.error("Error adding URL to blacklist:", error);
        return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
}
