import { UserAlreadyExistsError } from "../../core/errors/AppError.js";
import User from "../../models/user.model.js";
import { getUserByEmail } from "./getUserByEmail.js";

/**
 * Create a new user.
 * @param {object} data - User data including email, password, fullname, etc.
 * @returns {Promise<string>} - Returns the created user ID.
 * @throws {UserAlreadyExistsError} If a user with the same email already exists.
 */
export async function createUser(data) {
    try {
        const existingUser = await getUserByEmail(data.email);
        if (existingUser) {
            throw new UserAlreadyExistsError("Email already exists");
        }
    } catch (error) {
        if (error instanceof NotFoundError) {
            const user = await User.create(data);
            return user.id;
        } else {
            throw error;
        }
    }
}
