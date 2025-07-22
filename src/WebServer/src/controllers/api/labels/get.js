import { NotFoundError } from "../../../core/errors/AppError.js";
import StatusCode from "../../../core/StatusCode.js";
import { getAllLabels } from "../../../services/label/getAllLabels.js";

export async function getLabels(req, res) {
    const userId = req.userId;

    try {
        const allLabels = await getAllLabels(userId);
        res.status(StatusCode.OK).json(allLabels);
    } catch (error) {
        if (error instanceof NotFoundError)
            res.status(StatusCode.NOT_FOUND).json({ error: error.message });
        else res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
}
