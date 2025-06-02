import { deleteMailById } from "../../mails/mailsService.js";

export function deleteMail(req, res) {
    const { id } = req.params;

    const deleted = deleteMailById(id);

    if (!deleted) {
        return res.status(404).json({ error: "Mail not found" });
    }

    return res.status(204).end();
}
