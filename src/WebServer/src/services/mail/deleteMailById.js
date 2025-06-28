import User from "../../models/user.model.js";
import { getUserById } from "../user/getUserById.js";
import { getMailById } from "./getMailById.js";
import Label from "../../models/label.model.js";

/**
 * Delete a mail by its ID for a specific user.
 * @param {string} userId
 * @param {string} mailId
 * @returns {Promise<boolean>} - Returns true if successfully deleted.
 * @throws {NotFoundError} If the user or mail is not found.
 */
export async function deleteMailById(userId, mailId) {
    const user = await getUserById(userId);
    await user.populate("labels");

    await getMailById(userId, mailId); // Ensure mail exists and belongs to the user

    // Remove the mail from the user's mailbox
    await User.updateOne(
        { _id: userId },
        { $pull: { mails: mailId } }
    );

    await Label.updateMany(
        { _id: { $in: user.labels.map((l) => l._id) }, userId: userId },
        { $pull: { mails: mailId } }
    );

    return true;
}
