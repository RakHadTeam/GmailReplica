import { getUserById } from "../../users/userService.js";

export function getLabelById(token, id) {
    const user = getUserById(token);
    if (!user) {
        return { status: 401, error: "Unauthorized" }; // Unauthorized
    }
    const label = user.labels.find((label) => label.id === id);
    if (label == undefined) {
        return { status: 404, error: "Label not found" }; // Not Found
    }
    return { label, status: 200 };
}

export function updateLabel(token, id, updates) {
    const { label, status, error } = getLabelById(token, id);
    if (error) return { status, error }; // If the label was not found, return the status
    Object.assign(label, updates);
    return { status: 204 }; // No Content
}

export function deleteLabelById(token, id) {
    const user = getUserById(token);
    if (!user) {
        return { status: 401, error: "Unauthorized" }; // Unauthorized
    }
    const index = user.labels.findIndex((label) => label.id === id);
    if (index !== -1) {
        user.labels.splice(index, 1);
        return { status: 204 }; // No Content
    }
    return { status: 404, error: "Label not found" }; // Not Found
}
