import { NotFoundError } from "../../../../core/errors/AppError.js";
import StatusCode from "../../../../core/StatusCode.js";
import { getLabelById } from "../../../../services/label/getLabelById.js";

export async function getLabel(req, res) {
    const { id } = req.params; // Extracts the 'id' parameter from the URL
    const userId = req.userId;

    try {
        const label = await getLabelById(userId, id);
        res.status(StatusCode.OK).json(label);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(StatusCode.NOT_FOUND).json({ error: error.message });
        } else {
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }
}
