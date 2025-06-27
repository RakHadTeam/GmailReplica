import { UnauthorizedError } from "../../../core/errors/AppError.js";
import { getUserById } from "../../../services/user/getUserById.js";

export function getMe(req, res) {
    const userId = req.userId;

    try {
        const user = getUserById(userId);
        res.set("Cache-Control", "no-store")
            .status(200)
            .json({ userId: user.id });
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return res.status(401).json({ error: "Unauthorized" });
        } else {
            console.error("Error fetching user:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
