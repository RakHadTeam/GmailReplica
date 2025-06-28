import { getUserById } from "../user/getUserById.js";
import { getMailById } from "./getMailById.js";

/**
 * Delete a mail by its ID for a specific user.
 * @param {string} userId
 * @param {string} mailId
 * @returns {Promise<boolean>} - Returns true if successfully deleted.
 * @throws {NotFoundError} If the user or mail is not found.
 */
export async function deleteMailById(userId, mailId) {
    const user = await getUserById(userId);

    await getMailById(userId, mailId);

    await user.populate("labels");

    // Remove the mail from the user's mailbox
    user.mails = user.mails.filter((mId) => !mId.equals(mailId));
    user.labels.forEach((label) => {
        label.mails = label.mails.filter((mId) => !mId.equals(mailId));
    });

    await user.save();

    return true;
}
