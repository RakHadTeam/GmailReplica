import { NotFoundError } from "../../../core/errors/AppError.js";
import { getAllLabels } from "../../../services/label/getAllLabels.js";

export async function getLabels(req, res) {
    const userId = req.userId;

    try {
        const allLabels = await getAllLabels(userId);
        res.status(200).json(allLabels);
    } catch (error) {
        if (error instanceof NotFoundError)
            res.status(404).json({ error: error.message });
        else res.status(500).json({ error: "Internal server error" });
    }
}
