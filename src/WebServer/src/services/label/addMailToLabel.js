import { getLabelById } from "./getLabelById.js";
import { getMailById } from "../mail/getMailById.js";

export async function addMailToLabel(userId, labelId, mailId) {
    const label = await getLabelById(userId, labelId);
    const mail = await getMailById(userId, mailId);

    if (!mail) {
        throw new Error("Mail not found");
    }

    if (!label.mails.some(id => id.equals(mail._id))) {
        label.mails.push(mail._id);
        await label.save();
    }
}