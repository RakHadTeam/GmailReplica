import { getUserById } from "../user/getUserById.js";

/** * Get the latest mails for a user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Mail[]>} - A promise that resolves to an array of the latest Mail documents.
 */
export async function getLatestMails(userId) {
    const user = await getUserById(userId);
    await user.populate("mails");
    return user.mails.slice(-50).reverse();
}
