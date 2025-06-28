import jwt from "jsonwebtoken";
import { NotFoundError } from "../core/errors/AppError.js";
import { getUserById } from "../services/user/getUserById.js";

export async function requireAuth(req, res, next) {
    const token =
        req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await getUserById(decoded.id);
        req.userId = user.id; // attach user info
        next();
    } catch (err) {
        if (err instanceof NotFoundError) {
            return res.status(401).json({ error: "Unauthorized" });
        }
    }
}
