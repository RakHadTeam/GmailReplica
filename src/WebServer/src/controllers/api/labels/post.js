import { createLabel } from "../../../services/label/createLabel.js";

export async function postLabels(req, res) {
    const userId = req.userId;

    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }

    let newLabel = {
        name,
        mails: [],
    };

    try {
        const label = await createLabel(userId, newLabel);
        res.status(201)
            .location(`/api/labels/${label.id}`)
            .json({ id: label.id });
    } catch (error) {
        if (error instanceof AlreadyExistsError) {
            return res.status(409).json({ error: error.message });
        } else if (error instanceof NotFoundError) {
            return res.status(404).json({ error: error.message });
        } else {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
