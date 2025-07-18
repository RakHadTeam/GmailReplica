import {
    NotFoundError,
    UnauthorizedError,
} from "../../../../core/errors/AppError.js";
import { getMailById } from "../../../../services/mail/getMailById.js";

export async function getMailByIdHandler(req, res) {
    const { id } = req.params;

    const userId = req.userId;

    try {
        const mail = await getMailById(userId, id);
        res.status(200).json(mail);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ error: error.message });
        }
        if (error instanceof UnauthorizedError) {
            return res.status(401).json({ error: error.message });
        } else {
            console.error("Error fetching mail by ID:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
