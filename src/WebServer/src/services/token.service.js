import { UnauthorizedError } from "../core/errors/AppError.js";
import User from "../models/user.model.js";

/** * Validate user credentials.
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {string} - Returns the user ID if credentials are valid.
 * @throws {UnauthorizedError} If the credentials are invalid.
 */
export async function validateCredentials(email, password) {
    const user = await User.findOne({ email, password });
    if (!user) throw new UnauthorizedError("Invalid credentials");
    return {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        picture: user.picture,
    };
}
