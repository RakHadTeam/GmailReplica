import jwt from "jsonwebtoken";
import { verifyToken } from "../../../core/jwt.js";

export function getMe(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "No token provided in cookies" });
    }

    try {
        const decoded = verifyToken(token);
        if (!decoded || !decoded.id) {
            return res.status(403).json({ error: "Invalid token" });
        }
        res.set("Cache-Control", "no-store").status(200).json({ userId: decoded.id });
    } catch (err) {
        res.status(403).json({ error: "Invalid or expired token" });
    }
}