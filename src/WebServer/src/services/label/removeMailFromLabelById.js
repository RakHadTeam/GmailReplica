import {
    NotFoundError,
    UnauthorizedError,
} from "../../core/errors/AppError.js";
import { getMailById } from "../mail/getMailById.js";
import { getLabelById } from "./getLabelById.js";

/**
 * Remove a mail from a specific label owned by a user.
 * @param {string} userId - ID of the user.
 * @param {string} labelId - ID of the label.
 * @param {string} mailId - ID of the mail to remove.
 * @returns {Promise<{status: number}>}
 * @throws {UnauthorizedError|NotFoundError}
 */
export async function removeMailFromLabelById(userId, labelId, mailId) {
    const label = await getLabelById(userId, labelId);

    const mail = await getMailById(userId, mailId);

    const index = label.mails.findIndex((m) => m.equals(mail._id));
    if (index !== -1) {
        label.mails.splice(index, 1);
        await label.save();
    }
}
