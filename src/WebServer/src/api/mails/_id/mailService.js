import globals from "../../../core/globals.js";
import { getUserById, getUserByUsername } from "../../users/userService.js";
import { getAllLinksFromBody } from "../mailsService.js";

export function getMailById(token, id) {
    const user = getUserById(token);
    if (!user) {
        return { status: 401 };
    }
    const mailIndex = user.mails.find((m) => globals.mails[m].id === id);
    if (mailIndex == undefined) {
        return { status: 404 };
    }
    return { status: 200, mail: globals.mails[mailIndex] };
}

export function deleteMailById(token, id) {
    const user = getUserById(token);
    if (!user) {
        return { status: 401 };
    }

    const { mail, status, error } = getMailById(token, id);

    if (error) return { status, error };

    // Remove the mail from the user's mailbox
    user.mails = user.mails.filter(
        (mailIndex) => globals.mails[mailIndex].id !== id
    );
    return { status: 204 };
}

export function updateMailById(token, id, updates) {
    const { mail, status, error } = getMailById(token, id);
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
            getUserById(updates.recipient) ||
            getUserByUsername(updates.recipient);
        if (!recipientUser) {
            return { status: 404, error: "Recipient not found" };
        }
        mail.recipient = recipientUser.id;
    }

    if (updates.draft === false) {
        const links = getAllLinksFromBody(body).concat(
            getAllLinksFromBody(subject)
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
            getUserById(mail.recipient) || getUserByUsername(mail.recipient);

        if (!recipientUser) {
            return { status: 404, error: "Recipient not found" };
        }

        // Add the mail to the recipient's mailbox
        const draftIndex = globals.mails.findIndex((m) => m.id === id);

        if (recipientUser.mails.includes(draftIndex)) {
            return { status: 400, error: "Mail already sent to recipient" };
        }

        recipientUser.mails.push(draftIndex);

        mail.draft = false;
    }

    return { status: 204, mail };
}
