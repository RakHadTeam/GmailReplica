import { randomUUID } from "crypto";
import globals from "../core/globals.js";
import { sendBlacklistCommand } from "./blacklist.model.js";
import { getUserByEmail, getUserById } from "./user.model.js";

export function getLatestMails(userId) {
    const user = getUserById(userId);
    if (!user) {
        return { status: 401, error: "Unauthorized" };
    }
    // get the latest 50 mails
    return {
        status: 200,
        mails: user.mails
            .slice(-50)
            .map((mailIndex) => globals.mails[mailIndex] || null),
    };
}
function isURLBlacklisted(url) {
    return sendBlacklistCommand(`GET ${url}`);
}

export function getAllLinksFromBody(body) {
    const urlRegex =
        /((https?|ftp):\/\/)?([a-zA-Z0-9-]+\.){1,2}[a-zA-Z0-9-]+/gi;
    const links = [];
    let match;
    while ((match = urlRegex.exec(body)) !== null) {
        links.push(match[0]);
    }
    return links;
}

export async function createMail(userId, { subject, body, recipient, draft }) {
    const sender = getUserById(userId);
    let spammed = false;
    if (!sender) {
        return { status: 401, error: "Unauthorized" };
    }
    if (!draft) {
        const links = getAllLinksFromBody(body).concat(
            getAllLinksFromBody(subject)
        );
        for (const link of links) {
            if ((await isURLBlacklisted(link)) == 200) {
                spammed = true;
            }
        }
    }

    const recipientUser = getUserById(recipient) || getUserByEmail(recipient);
    if (!recipientUser && !draft) {
        return { status: 404, error: "Recipient not found" };
    }

    const newMail = {
        id: randomUUID(),
        subject,
        body,
        sender: sender.id,
        recipient: recipientUser ? recipientUser.id : null,
        draft: draft || false,
        createdAt: new Date().toISOString(),
    };

    globals.mails.push(newMail);
    const mailIndex = globals.mails.length - 1;

    // Always push to sender's mails
    sender.mails.push(mailIndex);

    // Only push to recipient's mails if not a draft
    if (!draft && recipientUser) {
        if (recipientUser.id !== sender.id) recipientUser.mails.push(mailIndex);
        if (spammed) {
            const spamLabel = recipientUser.labels.find(
                (label) => label.id === "Spam"
            );
            spamLabel.mails.push(newMail.id);
        }
    }

    return { id: newMail.id, status: 201 };
}
