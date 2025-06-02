import { updateMailById } from "./mailService.js";

export function patchMail(req, res) {
    const { id } = req.params;
    const { subject, body } = req.body;

    const token = req.headers.authorization?.split(" ")[1];

    if (typeof subject !== "string" && typeof body !== "string") {
        return res.status(400).json({ error: "Subject or body required for update" });
    }

    const status = updateMailById(token, id, { subject, body });

    return res.status(status).end();
}
