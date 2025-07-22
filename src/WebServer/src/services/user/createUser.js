import {
    NotFoundError,
    AlreadyExistsError,
} from "../../core/errors/AppError.js";
import User from "../../models/user.model.js";
import { createLabel } from "../label/createLabel.js";
import { getUserByEmail } from "./getUserByEmail.js";

/**
 * Create a new user.
 * @param {object} data - User data including email, password, fullname, etc.
 * @returns {Promise<string>} - Returns the created user ID.
 * @throws {AlreadyExistsError} If a user with the same email already exists.
 */
export async function createUser(data) {
    try {
        const existingUser = await getUserByEmail(data.email);
        if (existingUser) {
            throw new AlreadyExistsError("Email already exists");
        }
    } catch (error) {
        if (error instanceof NotFoundError) {
            const user = await User.create(data);
            await createLabel(user.id, { name: "Starred" });
            await createLabel(user.id, { name: "Sent" });
            await createLabel(user.id, { name: "Bin" });
            await createLabel(user.id, { name: "Spam" });
            return user.id;
        } else {
            throw error;
        }
    }
}
