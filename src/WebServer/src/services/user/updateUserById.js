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

    if (fieldsToUpdate.fullname) {
        user.fullname = fieldsToUpdate.fullname;
    }
    if (fieldsToUpdate.picture) {
        user.picture = fieldsToUpdate.picture;
    }
    await user.save();
    return true;
}
