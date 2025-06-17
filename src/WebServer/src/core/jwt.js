import jwt from "jsonwebtoken";

export function generateToken(user) {
    const secret = process.env.JWT_SECRET;
    return jwt.sign({ id: user.id }, secret, { expiresIn: "1h" });
}

export function verifyToken(token) {
    const secret = process.env.JWT_SECRET;
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        return null;
    }
}
