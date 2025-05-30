import { createLabel } from "./labelsService.js";


export function postLabels(req, res) {
    const { name } = req.body; // Destructure 'name' from the request body

    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }

    let newLabel = {
        name
    };

    newLabel = createLabel(newLabel)

    res.status(201).location(`/api/labels/${newLabel.id}`).send();
}
