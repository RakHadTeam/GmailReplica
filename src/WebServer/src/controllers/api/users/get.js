import { NotFoundError } from "../../../core/errors/AppError.js";
import StatusCode from "../../../core/StatusCode.js";
import { getUserById } from "../../../services/user/getUserById.js";

export async function getUserByIdHandler(req, res) {
    const { id } = req.params;

    try {
        const user = await getUserById(id);
        return res.status(StatusCode.OK).json({
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            picture: user.picture,
            darkTheme: user.darkTheme,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(StatusCode.NOT_FOUND).json({ error: "User not found" });
        } else {
            console.error("Error fetching user:", error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }
}
