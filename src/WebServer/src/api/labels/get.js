import { getAllLabels } from "./labelsService.js";

export function getLabels(req, res) {
    const token = req.headers.authorization?.split(" ")[1];

    const labels = getAllLabels(token);
    if (labels.status) {
        return res.status(labels.status).end(); // If there's an error, respond with the status code
    }
    res.status(200).json(labels); // Respond with HTTP 200 and the labels as JSON
}
