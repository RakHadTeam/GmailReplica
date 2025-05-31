import globals from "../../core/globals.js";
import { randomUUID } from "crypto";

export function getLatestMails() {
    const mails = globals.mails || [];
    return mails
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // newest to oldest
        .slice(0, 50);
}


