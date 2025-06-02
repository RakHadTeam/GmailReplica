export function getMailById(token, id) {
    const user = getUserById(token);
    if (!user) {
        return { status: 401 };
    }
    const mailIndex = user.mails.find((m) => globals.mails[m].id === id);
    if (!mailIndex) {
        return { status: 404 };
    }
    return globals.mails[mailIndex];
}

export function deleteMailById(token, id) {
    const user = getUserById(token);
    if (!user) {
        return 401;
    }

    const mail = getMailById(token, id);

    if (mail.status) return mail.status;

    // Remove the mail from the user's mailbox
    user.mails = user.mails.filter(
        (mailIndex) => globals.mails[mailIndex].id !== id
    );
    return 204;
}

export function updateMailById(token, id, updates) {
    const mail = getMailById(token, id);
    if (mail.status) return mail.status;

    if (typeof updates.subject === "string") {
        mail.subject = updates.subject;
    }

    if (typeof updates.body === "string") {
        mail.body = updates.body;
    }

    return 204;
}
