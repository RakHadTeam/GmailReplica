import { NotFoundError } from "../../../core/errors/AppError.js";
import { getUserById } from "../../../services/user/getUserById.js";

export async function getUserByIdHandler(req, res) {
    const { id } = req.params;

    try {
        const user = await getUserById(id);
        return res.status(200).json({
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            picture: user.picture,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ error: "User not found" });
        } else {
            console.error("Error fetching user:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
