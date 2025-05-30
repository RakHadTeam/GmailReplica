import { getAllLabels } from './labelsService.js';

export function getLabels(req, res) {
    const labels = getAllLabels();
    res.status(200).json(labels); // Respond with HTTP 200 and the labels as JSON
}
