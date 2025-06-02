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

    newLabel = createLabel(token, newLabel)

    res.status(201).location(`/api/labels/${newLabel.id}`).send();
}
