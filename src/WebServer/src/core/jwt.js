import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export function generateToken(user) {
    return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
}
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}
