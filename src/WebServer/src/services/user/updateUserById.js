import { getUserById } from "./getUserById.js";

/**
 * Update a user by their ID.
 * @param {string} id - User ID
 * @param {object} fieldsToUpdate - Fields to update (e.g., fullname, picture)
 * @returns {Promise<boolean>} - Returns true if the update was successful, false otherwise.
 * @throws {NotFoundError} If the user is not found.
 */
export async function updateUserById(id, fieldsToUpdate) {
    const user = await getUserById(id);

    await user.updateOne({ $set: fieldsToUpdate });
    return true;
}
