import StatusCode from "../../../../core/StatusCode.js";
import { deleteURLFromBlacklist } from "../../../../services/blacklist/deleteURLFromBlacklist.js";

export async function deleteBlacklistID(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(StatusCode.BAD_REQUEST).json({ error: "ID is required" });
    }

    try {
        const status = await deleteURLFromBlacklist(id);
        return res.status(status).end();
    } catch (error) {
        console.error("Error deleting URL from blacklist:", error);
        return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
}
