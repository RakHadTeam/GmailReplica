import { createMail } from "./mailsService.js";

export async function postMail(req, res) {
    const token = req.headers.authorization?.split(" ")[1];
    const { subject, body, recipient, draft } = req.body;


    if (!subject || !body || !recipient) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const { status, error, id } = await createMail(token, { subject, body, recipient, draft });

    if (error) {
        return res.status(status ?? 400).json({ error });
    }

    return res
        .status(status)
        .location(`/api/mails/${id}`)
        .json({ message: `${draft ? "Draft" : "Mail"} created successfully` });
}
