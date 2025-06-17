import { deleteURLFromBlacklist } from "../../../../models/blacklist.model.js";

export async function deleteBlacklistID(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    const status = await deleteURLFromBlacklist(id);
    return res.status(status).json();
}
