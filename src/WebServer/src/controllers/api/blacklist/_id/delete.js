import { deleteURLFromBlacklist } from "../../../../services/blacklist/deleteURLFromBlacklist.js";

export async function deleteBlacklistID(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    try {
        const status = await deleteURLFromBlacklist(id);
        return res.status(status).end();
    } catch (error) {
        console.error("Error deleting URL from blacklist:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
