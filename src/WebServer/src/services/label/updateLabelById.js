import Label from "../../models/label.model.js";
import { getLabelById } from "./getLabelById.js";

/** * Updates a label by its ID for a specific user.
 * @param {string} userId - The ID of the user.
 * @param {string} id - The ID of the label to update.
 * @param {object} updates - The updates to apply to the label.
 * @returns {Promise<void>} Resolves when the label is updated.
 * @throws {NotFoundError} If the label is not found.
 */
export async function updateLabelById(userId, id, updates) {

    await getLabelById(userId, id); // Ensure label exists
    await Label.updateOne({ _id: id, userId: userId }, { $set: updates });

}