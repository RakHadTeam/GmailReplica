import { getUserById } from "./user.model.js";

export function getLabelById(userId, id) {

    const user = getUserById(userId);
    if (!user) {
        return { status: 401, error: "Unauthorized" }; // Unauthorized
    }
    const label = user.labels.find((label) => label.id === id);
    if (label == undefined) {
        return { status: 404, error: "Label not found" }; // Not Found
    }
    return { label, status: 200 };
}

export function updateLabel(userId, id, updates) {

    const { label, status, error } = getLabelById(userId, id);
    if (error) return { status, error }; // If the label was not found, return the status
    Object.assign(label, updates);
    return { status: 204 }; // No Content
}

export function deleteLabelById(userId, id) {

    const user = getUserById(userId);
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

export function addMailToLabel(userId, labelId, mailId) {

    const user = getUserById(userId);
    if (!user) {
        return { status: 401, error: "Unauthorized" }; // Unauthorized
    }
    const label = user.labels.find((label) => label.id === labelId);
    if (!label) {
        return { status: 404, error: "Label not found" }; // Not Found
    }
    if (!label.mails.includes(mailId)) {
        label.mails.push(mailId);
    }
    return { status: 204 }; // No Content
}

export function removeMailFromLabelById(userId, labelId, mailId) {
  const user = getUserById(userId);
  if (!user) {
    return { status: 401, error: "Unauthorized" };
  }

  const label = user.labels.find(l => l.id === labelId);
  if (!label) {
    return { status: 404, error: "Label not found" };
  }

  if (!Array.isArray(label.mails)) {
    label.mails = [];
  }

  const idx = label.mails.indexOf(mailId);
  if (idx === -1) {
    return { status: 404, error: "Mail not found in label" };
  }

  label.mails.splice(idx, 1);

  return { status: 204 };
}