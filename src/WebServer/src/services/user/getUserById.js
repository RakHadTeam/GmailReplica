import mongoose from "mongoose";
import { NotFoundError } from "../../core/errors/AppError.js";
import User from "../../models/user.model.js";

/**
 * Get a user by their ID.
 * @param {string} id - User ID
 * @returns {Promise<User>} - Returns the user object if found.
 * @throws {NotFoundError} If the user is not found or ID is invalid.
 */
export async function getUserById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new NotFoundError("Invalid user ID format");
    }

    const user = await User.findById(id);
    if (!user) throw new NotFoundError("User not found");
    return user;
}
