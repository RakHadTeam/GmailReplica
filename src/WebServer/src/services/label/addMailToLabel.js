import { getLabelById } from "./getLabelById.js";
import { getMailById } from "../mail/getMailById.js";
import { NotFoundError } from "../../core/errors/AppError.js";

/** * Adds a mail to a label for a specific user.
 * @param {string} userId - The ID of the user.
 * @param {string} labelId - The ID of the label to which the mail will be added.
 * @param {string} mailId - The ID of the mail to be added to the label.
 * @returns {Promise<void>} Resolves when the mail is added to the label.
 * @throws {NotFoundError} If the mail or label is not found, or if the mail is already in the label.
 */
export async function addMailToLabel(userId, labelId, mailId) {
    const label = await getLabelById(userId, labelId);
    const mail = await getMailById(userId, mailId);

    if (!mail) {
        throw new NotFoundError("Mail not found");
    }

    if (!label.mails.some(id => id.equals(mail._id))) {
        await label.constructor.updateOne(
            { _id: label._id },
            { $push: { mails: mail._id } }
        );
    }
}