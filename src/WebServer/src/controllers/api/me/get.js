import jwt from "jsonwebtoken";
import { verifyToken } from "../../../core/jwt.js";
import { getUserById } from "../../../models/user.model.js";

export function getMe(req, res) {
    
    const userId = req.userId;

    const user = getUserById(userId);
    if (!user) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }

    res.set("Cache-Control", "no-store").status(200).json({ userId });
}