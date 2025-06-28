import crypto from "crypto";
import { getUserById } from "../services/user/getUserById.js";

export function getAllLabels(userId) {
    const user = getUserById(userId);
    if (!user) {
        return { status: 401, error: "Unauthorized" };
    }
    return { status: 200, labels: user.labels || [] };
}

export function createLabel(userId, data) {
    const user = getUserById(userId);
    if (!user) {
        return { status: 401, error: "Unauthorized" };
    }
    const existingLabel = user.labels.find(label => label.name === data.name);
    if (existingLabel) {
        return { status: 400, error: "Label already exists" };
    }
    const id = crypto.randomUUID();
    const newLabel = { id, ...data };
    user.labels.push(newLabel);
    return { status: 201, label: newLabel };
}
