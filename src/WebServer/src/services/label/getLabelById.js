import { NotFoundError } from "../../core/errors/AppError.js";
import { getUserById } from "../user/getUserById.js";
import Label from "../../models/label.model.js";

/** * Retrieves a label by its ID for a specific user.
 * @param {string} userId - The ID of the user.
 * @param {string} id - The ID of the label to retrieve.
 * @returns {Promise<Label>} The label object if found.
 * @throws {NotFoundError} If the label is not found.
 */
export async function getLabelById(userId, id) {
    const user = await getUserById(userId);
    await user.populate("labels");

    const label = user.labels.find((label) => label.id === id);
    if (!label) throw new NotFoundError("Label not found");

    return label;
}
