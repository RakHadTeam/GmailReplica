import { createMail } from "../../../models/mails.model.js";

export async function postMail(req, res) {
    const userId = req.userId;
    const { subject, body, recipient, draft = false } = req.body;

    if (!draft) {
        if (!subject || !body || !recipient) {
            return res.status(400).json({ error: "Missing required fields" });
        }
    }

    const mailData = {
        subject: subject ?? "",
        body: body ?? "",
        draft,
        ...(!draft && { recipient }),
        
    };

    console.log("Creating mail with data:", mailData);

    const { status, error, id } = await createMail(userId, mailData);

    if (error) {
        return res.status(status ?? 400).json({ error });
    }

    return res
        .status(status)
        .location(`/api/mails/${id}`)
        .json({
            message: draft ? "Draft saved successfully" : "Mail sent successfully",
            id,
        });
}
