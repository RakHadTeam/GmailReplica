import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/** * Generates a JWT token for a user.
 * @param {User} user - The user to generate a token for.
 * @returns {string} - Returns the generated JWT token.
 */
export function generateToken(user) {
    const secret = process.env.JWT_SECRET;
    return jwt.sign({ id: user.id }, secret, {
        expiresIn: process.env.TOKEN_EXPIRY || "1h",
    });
}

/** * Verifies a JWT token and returns the decoded payload.
 * @param {string} token - The JWT token to verify.
 * @returns {object|null} - Returns the decoded payload if valid, otherwise null.
 */
export function verifyToken(token) {
    const secret = process.env.JWT_SECRET;
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        return null;
    }
}

/** * Extracts the user ID from a JWT token.
 * @param {string} token - The JWT token to extract the user ID from.
 * @returns {string|null} - Returns the user ID if valid, otherwise null.
 * */
export function getUserIdFromToken(token) {
    const decoded = verifyToken(token);
    return decoded.id ?? null;
}
