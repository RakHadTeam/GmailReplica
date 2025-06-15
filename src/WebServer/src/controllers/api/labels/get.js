import { getAllLabels } from "../../../models/labels.model.js";

export function getLabels(req, res) {
    const token = req.headers.authorization?.split(" ")[1];

    const { status, labels, error } = getAllLabels(token);
    if (error) {
        return res.status(status).end(); // If there's an error, respond with the status code
    }
    res.status(status).json(labels); // Respond with HTTP 200 and the labels as JSON
}
