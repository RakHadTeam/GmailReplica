import {
    NotFoundError,
} from "../../core/errors/AppError.js";
import { getMailById } from "../mail/getMailById.js";
import Label from "../../models/label.model.js";

/**
 * Remove a mail from a specific label owned by a user.
 * @param {string} userId - ID of the user.
 * @param {string} labelId - ID of the label.
 * @param {string} mailId - ID of the mail to remove.
 * @returns {Promise<void>}
 * @throws {UnauthorizedError|NotFoundError}
 */
export async function removeMailFromLabelById(userId, labelId, mailId) {
    const mail = await getMailById(userId, mailId);

    const result = await Label.updateOne(
        { _id: labelId, userId: userId },
        { $pull: { mails: mail._id } }
    );

    if (result.matchedCount === 0) {
        throw new NotFoundError("Label not found or unauthorized");
    }
}
