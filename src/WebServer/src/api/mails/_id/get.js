import { getMailById } from "../../mails/mailsService.js";

export function getMailByIdHandler(req, res) {
    const { id } = req.params;
    const mail = getMailById(id);

    if (!mail) {
        return res.status(404).json({ error: "Mail not found" });
    }

    res.status(200).json(mail);
}
