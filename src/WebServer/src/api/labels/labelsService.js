import { getUserById } from "../users/userService.js";

export function getAllLabels(token) {
    const user = getUserById(token);
    if (!user) {
        return { status: 401, error: "Unauthorized" }; // Unauthorized
    }
    return { status: 200, labels: user.labels || [] };
}

export function createLabel(token, data) {
    const user = getUserById(token);
    if (!user) {
        return { status: 401, error: "Unauthorized" }; // Unauthorized
    }
    const id = crypto.randomUUID();
    const newLabel = { id, ...data };
    user.labels.push(newLabel);
    return { status: 201, label: newLabel };
}
