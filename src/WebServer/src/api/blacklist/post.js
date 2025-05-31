import { addURLToBlacklist } from "./blacklistService.js";

export function postBlacklist(req, res) {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ message: "URL is required" });
    }

    addURLToBlacklist(url);

    return res
        .status(201)
        .json({ message: "URL added to blacklist successfully" });
}
