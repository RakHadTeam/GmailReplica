import { getUserById } from "../user/getUserById.js";
import Label from "../../models/label.model.js";

/**
 * Retrieves all labels for a specific user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Label[]>} An array of label objects.
 * @throws {NotFoundError} If the user is not found.
 */
export async function getAllLabels(userId) {
    const user = await getUserById(userId);
    await user.populate("labels");

    return user.labels;
}
