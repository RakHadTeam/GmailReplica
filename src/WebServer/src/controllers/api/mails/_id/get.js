import {
    NotFoundError,
    UnauthorizedError,
} from "../../../../core/errors/AppError.js";
import StatusCode from "../../../../core/StatusCode.js";
import { getMailById } from "../../../../services/mail/getMailById.js";

export async function getMailByIdHandler(req, res) {
    const { id } = req.params;

    const userId = req.userId;

    try {
        const mail = await getMailById(userId, id);
        res.status(StatusCode.OK).json(mail);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(StatusCode.NOT_FOUND).json({ error: error.message });
        }
        if (error instanceof UnauthorizedError) {
            return res.status(StatusCode.UNAUTHORIZED).json({ error: error.message });
        } else {
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }
}
