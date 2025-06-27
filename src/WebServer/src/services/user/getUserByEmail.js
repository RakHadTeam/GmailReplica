import { NotFoundError } from "../../core/errors/AppError.js";
import User from "../../models/user.model.js";

/**
 * Get a user by their email.
 * @param {string} email - User email
 * @returns {Promise<User>} - Returns the user object if found, otherwise null.
 * @throws {NotFoundError} If the user is not found.
 */
export async function getUserByEmail(email) {
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError("User not found");
    return user;
}
