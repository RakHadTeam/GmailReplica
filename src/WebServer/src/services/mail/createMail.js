import { NotFoundError } from "../../core/errors/AppError.js";
import Mail from "../../models/mail.model.js";
import { getAllLinksFromBody } from "../blacklist/getAllLinksFromBody.js";
import { isURLBlacklisted } from "../blacklist/isURLBlacklisted.js";
import { getUserByEmail } from "../user/getUserByEmail.js";
import { getUserById } from "../user/getUserById.js";

/**
 * Create and send a new mail.
 * @param {string} userId - The sender's user ID.
 * @param {object} param1 - Mail content and recipient info.
 * @param {string} param1.subject - The subject of the mail.
 * @param {string} param1.body - The body content of the mail.
 * @param {string} param1.recipient - The recipient's ID or email.
 * @param {boolean} param1.draft - Whether the mail is a draft.
 * @returns {Promise<Mail>} - The created Mail document.
 * @throws {NotFoundError}
 */
export async function createMail(userId, { subject, body, recipient, draft }) {
    const sender = await getUserById(userId);

    let spammed = false;

    let recipientUser = null;
    try {
        recipientUser = await getUserById(recipient);
    } catch (error) {
        if (!(error instanceof NotFoundError)) throw error;
        try {
            recipientUser = await getUserByEmail(recipient);
        } catch (innerError) {
            if (innerError instanceof NotFoundError && !draft) {
                throw innerError;
            }
        }
    }

    if (!draft) {
        const links = getAllLinksFromBody(body).concat(
            getAllLinksFromBody(subject)
        );
        for (const link of links) {
            if (await isURLBlacklisted(link)) {
                spammed = true;
                break;
            }
        }
    }

    const mail = await Mail.create({
        subject,
        body,
        sender: sender._id,
        recipient: recipientUser ? recipientUser._id : null,
        draft: draft || false,
    });

    await sender.updateOne({ $addToSet: { mails: mail._id } });

    if (!draft && recipientUser) {
        if (!recipientUser._id.equals(sender._id)) {
            await recipientUser.updateOne({ $addToSet: { mails: mail._id } });
        }

        await sender.populate("labels");
        const sentLabel = sender.labels.find((label) => label.name === "Sent");
        if (sentLabel) {
            await sentLabel.updateOne({ $addToSet: { mails: mail._id } });
        }

        if (spammed) {
            await recipientUser.populate("labels");
            const spamLabel = recipientUser.labels.find(
                (label) => label.name === "Spam"
            );
            if (spamLabel) {
                await spamLabel.updateOne({ $addToSet: { mails: mail._id } });
            }
        }
    }

    return mail;
}
