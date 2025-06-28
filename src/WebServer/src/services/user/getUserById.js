import { NotFoundError } from "../../core/errors/AppError.js";
import User from "../../models/user.model.js";

/**
 * Get a user by their ID.
 * @param {string} id - User ID
 * @returns {Promise<User>} - Returns the user object if found, otherwise null.
 * @throws {NotFoundError} If the user is not found.
 */
export async function getUserById(id) {
    const user = await User.findById(id);
    if (!user) throw new NotFoundError("User not found");
    return user;
}
