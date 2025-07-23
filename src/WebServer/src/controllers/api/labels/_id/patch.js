import { NotFoundError } from "../../../../core/errors/AppError.js";
import StatusCode from "../../../../core/StatusCode.js";
import { updateLabelById } from "../../../../services/label/updateLabelById.js";

export async function patchLabel(req, res) {
    const { id } = req.params; // Gets the ID from the URL
    const { name } = req.body; // Gets the new name from the request body

    const userId = req.userId;
    if (!name) {
        return res.status(StatusCode.BAD_REQUEST).json({ error: "Name is required" }); // Returns an error if name is not provided
    }

    try {
        await updateLabelById(userId, id, { name });
        return res.status(StatusCode.NO_CONTENT).location(`/api/labels/${id}`).send();
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(StatusCode.NOT_FOUND).json({ error: error.message });
        } else {
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }
}
