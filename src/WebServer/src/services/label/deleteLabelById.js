import { getUserById } from "../user/getUserById.js";
import { getLabelById } from "./getLabelById.js";

/** * Deletes a label by its ID for a specific user.
 * @param {string} userId - The ID of the user.
 * @param {string} id - The ID of the label to delete.
 * @returns {Promise<void>} Resolves when the label is deleted.
 * @throws {NotFoundError} If the label is not found.
 */
export async function deleteLabelById(userId, id) {
    const user = await getUserById(userId);
    const label = await getLabelById(userId, id);

    user.labels = user.labels.filter((label) => label.id !== id);
    await user.save();

    await label.deleteOne();
}
