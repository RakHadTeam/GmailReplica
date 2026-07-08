import { MailValidationError } from "../../core/errors/AppError.js";
import { getAllLinksFromBody } from "../blacklist/getAllLinksFromBody.js";
import { isURLBlacklisted } from "../blacklist/isURLBlacklisted.js";
import { getUserByEmail } from "../user/getUserByEmail.js";
import { getUserById } from "../user/getUserById.js";
import { getMailById } from "./getMailById.js";

/**
 * Update a mail by its ID for a specific user.
 * @param {string} userId
 * @param {string} mailId
 * @param {object} updates - The updates to apply to the mail
 * @returns {Promise<Mail>} - The updated mail object.
 * @throws {MailValidationError} If the mail is invalid or update fails.
 */
export async function updateMailById(userId, mailId, updates) {
    const mail = await getMailById(userId, mailId);

    if (!mail.draft) {
        throw new MailValidationError("Only drafts can be updated");
    }

    if (updates.subject) {
        mail.subject = updates.subject;
    }
    if (updates.body) {
        mail.body = updates.body;
    }
    if (updates.recipient) {
        try {
            const recipientUser = await getUserByEmail(updates.recipient);
            if (recipientUser) mail.recipient = recipientUser.id;
        } catch (error) {
            mail.recipient = updates.recipient;
        }
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
        let spammed = false;
        for (const link of links) {
            if (await isURLBlacklisted(link)) {
                spammed = true;
            }
        }

        let recipientUser = null;
        try {
            recipientUser = await getUserById(mail.recipient.toString());
        } catch (error) {
            try {
                recipientUser = await getUserByEmail(mail.recipient);
            } catch (error) {
                throw new MailValidationError(
                    "Recipient user not found for the provided email"
                );
            }
        }

        // Add mailId to recipientUser.mails using updateOne
        await recipientUser.updateOne({ $addToSet: { mails: mailId } });

        await recipientUser.populate("labels");

        if (spammed) {
            const spamLabel = recipientUser.labels.find(
                (label) => label.name === "Spam"
            );
            if (spamLabel) {
                await spamLabel.updateOne({ $addToSet: { mails: mailId } });
            }
        }

        mail.draft = false;

        const sender = await getUserById(userId);
        await sender.populate("labels");
        if (sender) {
            const sentLabel = sender.labels.find(
                (label) => label.name === "Sent"
            );
            if (sentLabel) {
                await sentLabel.updateOne({ $addToSet: { mails: mailId } });
            }
        }

    }

    await mail.save();

    return mail;
}
