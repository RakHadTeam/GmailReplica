import { sendMail } from "./mailsService.js";

export async function postMail(req, res) {
    const token = req.headers.authorization?.split(" ")[1];
    const { subject, body, recipient } = req.body;

    if (!subject || !body || !recipient) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await sendMail(token, { subject, body, recipient });

    if (result.status) {
        return res.status(result.status).end();
    }

    if (result.error) {
        return res.status(result.status ?? 400).json({ error: result.error });
    }

    return res.status(201).location(`/api/mails/${result.id}`).end();
}
