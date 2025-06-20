import globals from "../core/globals.js";
import { getAllLinksFromBody } from "./mails.model.js";
import { getUserByEmail, getUserById } from "./user.model.js";

export function getMailById(userId, id) {
    const user = getUserById(userId);
    if (!user) {
        return { status: 401 };
    }
    const mailIndex = user.mails.find((m) => globals.mails[m].id === id);
    if (mailIndex == undefined) {
        return { status: 404 };
    }
    return { status: 200, mail: globals.mails[mailIndex] };
}

export function deleteMailById(userId, id) {
    const user = getUserById(userId);
    if (!user) {
        return { status: 401 };
    }

    const { mail, status, error } = getMailById(userId, id);

    if (error) return { status, error };

    // Remove the mail from the user's mailbox
    user.mails = user.mails.filter(
        (mailIndex) => globals.mails[mailIndex].id !== id
    );
    user.labels.forEach((label) => {
        label.mails = label.mails.filter(
            (mailId) => mailId !== id
        );
    });

    return { status: 204 };
}

export function updateMailById(userId, id, updates) {
    const { mail, status, error } = getMailById(userId, id);
    if (error) {
        return { status, error };
    }

    if (!mail.draft)
        return { status: 400, error: "Only drafts can be updated" };

    if (updates.subject) {
        mail.subject = updates.subject;
    }

    if (updates.body) {
        mail.body = updates.body;
    }

    if (updates.recipient) {
        const recipientUser =
            getUserById(updates.recipient) || getUserByEmail(updates.recipient);
        if (recipientUser) {
            mail.recipient = recipientUser.id;
        } else mail.recipient = updates.recipient;
    }

    if (
        updates.draft === false &&
        updates.recipient &&
        updates.body &&
        updates.subject
    ) {
        const links = getAllLinksFromBody(mail.body).concat(
            getAllLinksFromBody(mail.subject)
        );
        for (const link of links) {
            if (isURLBlacklisted(link)) {
                return {
                    status: 400,
                    error: "Mail contains blacklisted content",
                };
            }
        }

        const recipientUser =
            getUserById(mail.recipient) || getUserByEmail(mail.recipient);

        if (!recipientUser) {
            return { status: 404, error: "Recipient not found" };
        }

        // Add the mail to the recipient's mailbox
        const draftIndex = globals.mails.findIndex((m) => m.id === id);

        recipientUser.mails.push(draftIndex);

        mail.draft = false;
    }

    return { status: 204, mail };
}
