import { deleteURLFromBlacklist } from "../../../../models/blacklist.model.js";

export async function deleteBlacklistID(req, res) {
    const { id } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    const status = await deleteURLFromBlacklist(id);
    return res.status(status).json();
}
