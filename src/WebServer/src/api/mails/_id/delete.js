import globals from "../../../core/globals.js";

export function deleteMail(req, res) {
    const { id } = req.params;
    const index = globals.mails.findIndex(mail => mail.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Mail not found" });
    }

    globals.mails.splice(index, 1);
    return res.status(204).end();
}
