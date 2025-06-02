import { getUserById } from "../../users/userService.js";

export function getLabelById(token, id) {
    const user = getUserById(token);
    if (!user) {
        return { status: 401 }; // Unauthorized
    }
    const label = user.labels.find((label) => label.id === id);
    if (!label) {
        return { status: 404 }; // Not Found
    }
    return label;
}

export function updateLabel(token, id, updates) {
    const label = getLabelById(token, id);
    if (label.status) return label.status; // If the label was not found, return the status
    Object.assign(label, updates);
    return 204; // No Content
}

export function deleteLabelById(token, id) {
    const user = getUserById(token);
    if (!user) {
        return { status: 401 }; // Unauthorized
    }
    const index = user.labels.findIndex((label) => label.id === id);
    if (index !== -1) {
        user.labels.splice(index, 1);
        return 204; // No Content
    }
    return 404; // Not Found
}
