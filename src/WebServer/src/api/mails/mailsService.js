import globals from "../../core/globals.js";
import { randomUUID } from "crypto";

export function getLatestMails() {
    const mails = globals.mails || [];
    return mails
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // newest to oldest
        .slice(0, 50);
}

export function sendMail({ subject, body, recipient }) {
    const blacklisted = globals.blacklist || [];
    const hasBlacklistedUrl = blacklisted.some(url => body.includes(url));

    if (hasBlacklistedUrl) {
        return { error: "Body contains blacklisted content" };
    }

    const newMail = {
        id: randomUUID(),
        subject,
        body,
        recipient,
        date: new Date().toISOString()
    };

    globals.mails = globals.mails || [];
    globals.mails.push(newMail);

    return { success: true };
}
