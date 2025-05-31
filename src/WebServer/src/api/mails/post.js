import { sendMail } from "./mailsService.js";

export function postMail(req, res) {
    const { subject, body, recipient } = req.body;

    if (!subject || !body || !recipient) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const result = sendMail({ subject, body, recipient });

    if (result.error) {
        return res.status(400).json({ error: result.error });
    }

    return res.status(201).send();
}
