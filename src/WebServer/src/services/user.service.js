import User from "../models/user.js";

/**
 * Get a user by their ID.
 * @param {string} id - User ID
 * @returns {Promise<User|null>} - Returns the user object if found, otherwise null.
 */
export async function getUserById(id) {
    const user = await User.findById(id);
    return user || null;
}

/**
 * Get a user by their email.
 * @param {string} email - User email
 * @returns {Promise<User|null>} - Returns the user object if found, otherwise null.
 * 
 */
export async function getUserByEmail(email) {
    const user = await User.findOne({ email });
    return user || null;
}

/**
 * Create a new user.
 * @param {object} data - User data including email, password, fullname, etc.
 * @returns {Promise<User>} - Returns the created user.
 * @throws {Error} If a user with the same email already exists.
 */
export async function createUser(data) {
    const existingUser = await getUserByEmail(data.email);
    if (existingUser) {
        throw new Error("Email already exists");
    }

    const user = await User.create(data);
    return user;
}

/**
 * Update a user by their ID.
 * @param {string} id - User ID
 * @param {object} fieldsToUpdate - Fields to update (e.g., fullname, picture)
 * @returns {Promise<boolean>} - Returns true if the update was successful, false otherwise.
 * @throws {Error} If the user is not found.
 */
export async function updateUserById(id, fieldsToUpdate) {
    const user = await getUserById(id);
    if (!user) {
        throw new Error("User not found");
    }
    if (fieldsToUpdate.fullname) {
        user.fullname = fieldsToUpdate.fullname;
    }
    if (fieldsToUpdate.picture) {
        user.picture = fieldsToUpdate.picture;
    }
    await user.save();
    return true;
}
