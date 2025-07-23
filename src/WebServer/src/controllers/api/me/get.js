import { NotFoundError } from "../../../core/errors/AppError.js";
import StatusCode from "../../../core/StatusCode.js";
import { getUserById } from "../../../services/user/getUserById.js";

export async function getMe(req, res) {
    const userId = req.userId;

    try {
        const user = await getUserById(userId);
        res.set("Cache-Control", "no-store")
            .status(StatusCode.OK)
            .json({ userId: user.id });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(StatusCode.UNAUTHORIZED).json({ error: "Unauthorized" });
        } else {
            console.error("Error fetching user:", error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }
}
