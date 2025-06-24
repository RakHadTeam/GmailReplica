import { randomUUID } from "crypto";
import globals from "../core/globals.js";
import { isURLBlacklisted } from "./blacklist.model.js";
import { getUserByEmail, getUserById } from "./user.model.js";

export function getLatestMails(userId) {
    const user = getUserById(userId);
    if (!user) {
        return { status: 401, error: "Unauthorized" };
    }
    return {
        status: 200,
        mails: user.mails
            .slice(-50)
            .map((mailIndex) => globals.mails[mailIndex] || null),
    };
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
        const links = getAllLinksFromBody(body).concat(getAllLinksFromBody(subject));
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

    sender.mails.push(mailIndex);

    if (!draft && recipientUser) {
        if (recipientUser.id !== sender.id) recipientUser.mails.push(mailIndex);
        
        const sentLabel = sender.labels.find(label => label.id === "Sent");
        if (sentLabel && !sentLabel.mails.includes(newMail.id)) {
            sentLabel.mails.push(newMail.id);
        }
        if (spammed) {
            const spamLabel = recipientUser.labels.find((label) => label.id === "Spam");
            if (spamLabel && !spamLabel.mails.includes(newMail.id)) {
                spamLabel.mails.push(newMail.id);
            }
        }
    }

    return { id: newMail.id, status: 201 };
}

