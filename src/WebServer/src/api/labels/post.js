import { createLabel } from "./labelsService.js";


export function postLabels(req, res) {
    const token = req.headers.authorization?.split(" ")[1];

    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }

    let newLabel = {
        name
    };

    const { status, label } = createLabel(token, newLabel)

    res.status(status).location(`/api/labels/${label.id}`).send();
}
