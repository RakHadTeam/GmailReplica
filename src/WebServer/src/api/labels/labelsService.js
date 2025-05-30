import globals from '../../core/globals.js';

export function getAllLabels() {
    return globals.labels;
}

export function getLabelById(id) {
    return globals.labels.find((label) => label.id === id);
}

export function createLabel(data) {
    const id = crypto.randomUUID();
    const newLabel = { id, ...data };
    globals.labels.push(newLabel);
    return newLabel;
}

export function updateLabel(id, updates) {
    const label = getLabelById(id);
    if (!label) return null;
    Object.assign(label, updates);
    return label;
}

export function deleteLabelById(id) {
    const index = globals.labels.findIndex((label) => label.id === id);
    if (index !== -1) {
        globals.labels.splice(index, 1);
        return true;
    }
    return false;
}