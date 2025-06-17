import jwt from "jsonwebtoken";
import { verifyToken } from "../../../core/jwt.js";

export function getMe(req, res) {
    
    const userId = req.userId;

    res.set("Cache-Control", "no-store").status(200).json({ userId });
}