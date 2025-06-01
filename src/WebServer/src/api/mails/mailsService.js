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

export function searchMails(query) {
    const mails = globals.mails || [];
    return mails.filter(mail =>
        (mail.subject && mail.subject.toLowerCase().includes(query)) ||
        (mail.body && mail.body.toLowerCase().includes(query)) ||
        (mail.recipient && mail.recipient.toLowerCase().includes(query))
    );
}

export function getMailById(id) {
    return (globals.mails || []).find(m => m.id === id);
}

export function deleteMailById(id) {
    const mails = globals.mails || [];
    const index = mails.findIndex(mail => mail.id === id);
    if (index === -1) return false;
    mails.splice(index, 1);
    return true;
}

export function patchMailById(id, updates) {
    const mails = globals.mails || [];
    const mail = mails.find(mail => mail.id === id);
    if (!mail) return null;
    if (updates.subject) mail.subject = updates.subject;
    if (updates.body) mail.body = updates.body;
    return mail;
}

export function updateMailById(id, updates) {
    const mail = globals.mails.find(mail => mail.id === id);
    if (!mail) return null;
    if (updates.subject) mail.subject = updates.subject;
    if (updates.body) mail.body = updates.body;
    return mail;
}
