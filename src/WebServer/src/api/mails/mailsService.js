import { randomUUID } from "crypto";
import globals from "../../core/globals.js";
import { sendBlacklistCommand } from "../blacklist/blacklistService.js";
import { getUserById, getUserByUsername } from "../users/userService.js";

export function getLatestMails(token) {
    const user = getUserById(token);
    if (!user) {
        return { status: 401 };
    }
    // get the latest 50 mails
    return user.mails.slice(-50);
}

function isURLBlacklisted(url) {
    return sendBlacklistCommand(`GET ${url}`);
}

function getAllLinksFromBody(body) {
    const urlRegex =
        /((https?|ftp):\/\/)?([a-zA-Z0-9-]+\.){1,2}[a-zA-Z0-9-]+/gi;
    const links = [];
    let match;
    while ((match = urlRegex.exec(body)) !== null) {
        links.push(match[0]);
    }
    return links;
}

export async function sendMail(token, { subject, body, recipient }) {
    const sender = getUserById(token);
    if (!sender) {
        return { status: 401 };
    }
    const links = getAllLinksFromBody(body);
    for (const link of links) {
        if ((await isURLBlacklisted(link)) == 200) {
            return { error: "Body contains blacklisted content" };
        }
    }

    const recipientUser = getUserById(recipient) || getUserByUsername(recipient);
    if (!recipientUser) {
        return { status: 404, error: "Recipient not found" };
    }

    const newMail = {
        id: randomUUID(),
        subject,
        body,
        sender: sender.id,
        recipient: recipientUser.id,
        date: new Date().toISOString(),
    };

    let mailIndex = recipientUser.mails.length;
    globals.mails.push(newMail);

    // Add the mail array index to the recipient's mailbox
    recipientUser.mails.push(mailIndex);
    // Add the mail array index to the sender's mailbox
    sender.mails.push(mailIndex);

    return { id: newMail.id };
}

