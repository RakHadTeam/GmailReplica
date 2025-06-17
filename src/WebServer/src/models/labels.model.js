import { getUserById } from "./user.model.js";
import crypto from "crypto";

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
    const id = crypto.randomUUID();
    const newLabel = { id, ...data };
    user.labels.push(newLabel);
    return { status: 201, label: newLabel };
}
