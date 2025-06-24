import User from "../models/user.js";

/**
 * Get a user by their ID.
 * @param {string} id
 * @returns {Promise<{status: number, user?: object, error?: string}>}
 */
export async function getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
        return { status: 404, error: "User not found" };
    }
    return { status: 200, user };
}

/** * Get a user by their email.
 * @param {string} email
 * @returns {Promise<{status: number, user?: object, error?: string}>}
 */
export async function getUserByEmail(email) {
    const user = await User.findOne({ email });
    if (!user) {
        return { status: 404, error: "User not found" };
    }
    return { status: 200, user };
}

/** * Create a new user.
 * @param {object} data - User data including email, password, fullname, etc.
 * @returns {Promise<{status: number, id?: string, message?: string, error?: string}>}
 */
export async function createUser(data) {
    const existingUser = await getUserByEmail(data.email);
    if (existingUser.status === 200) {
        return { status: 400, error: "Email already exists" };
    }

    await User.create(data);
    return { status: 201, id: data.id, message: "User created successfully" };
}

/**
 * Update a user by their ID.
 * @param {string} id - User ID
 * @param {object} fieldsToUpdate - Fields to update
 * @returns {Promise<boolean>} - Returns true if the update was successful, false otherwise
 */

export async function updateUserById(id, fieldsToUpdate) {
    const user = await getUserById(id);
    if (!user) return false;
    if (fieldsToUpdate.fullname) {
        user.fullname = fieldsToUpdate.fullname;
    }
    if (fieldsToUpdate.picture) {
        user.picture = fieldsToUpdate.picture;
    }
    await user.save();
    return true;
}
