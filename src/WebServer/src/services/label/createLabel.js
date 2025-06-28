import {
    UserAlreadyExistsError as AlreadyExistsError,
    NotFoundError,
} from "../../core/errors/AppError.js";
import Label from "../../models/label.model.js";
import { getUserById } from "../user/getUserById.js";

/**
 * Create a new label for the given user.
 * @param {string} userId - The user's ID.
 * @param {{ name: string }} data - The label data containing a unique name.
 * @returns {Promise<Label>}
 * @throws {NotFoundError|AlreadyExistsError} If the user is not found or the label already exists.
 */
export async function createLabel(userId, data) {
    const user = await getUserById(userId);

    await user.populate("labels");

    const existingLabel = user.labels.find((label) => label.name === data.name);
    if (existingLabel)
        throw new AlreadyExistsError("Label with this name already exists");

    const newLabel = await Label.create({ name: data.name, mails: [] });

    user.labels.push(newLabel._id);
    await user.save();

    return newLabel;
}
