import { getMailById } from "./mailService.js";

export function getMailByIdHandler(req, res) {
    const { id } = req.params;

    const token = req.headers.authorization?.split(" ")[1];

    const mail = getMailById(token, id);

    if (mail.status) {
        return res.status(mail.status).end();
    }

    res.status(200).json(mail);
}
