import Mail from "../models/mail.js";
import { getAllLinksFromBody, isURLBlacklisted } from "./blacklist.service.js";
import { getUserByEmail, getUserById } from "./user.service.js";

/**
 * Get a mail by its ID for a specific user.
 * @param {string} userId
 * @param {string} id
 * @returns {Promise<Mail>} - The requested mail object.
 * @throws {Error} If the user or mail is not found or unauthorized.
 */
export async function getMailById(userId, id) {
    const user = await getUserById(userId);
    if (!user) throw new Error("User not found");

    const mail = await Mail.findById(id);
    if (!mail) throw new Error("Mail not found");

    if (!user.mails.includes(mail.id))
        throw new Error("Unauthorized access to this mail");

    return mail;
}

/**
 * Delete a mail by its ID for a specific user.
 * @param {string} userId
 * @param {string} mailId
 * @returns {Promise<boolean>} - Returns true if successfully deleted.
 * @throws {Error} If the user or mail is not found.
 */
export async function deleteMailById(userId, mailId) {
    const user = await getUserById(userId);
    if (!user) throw new Error("User not found");

    await getMailById(userId, mailId);

    await user.populate("labels");

    // Remove the mail from the user's mailbox
    user.mails = user.mails.filter((mId) => !mId.equals(mailId));
    user.labels.forEach((label) => {
        label.mails = label.mails.filter((mId) => !mId.equals(mailId));
    });

    await user.save();

    return true;
}

/**
 * Update a mail by its ID for a specific user.
 * @param {string} userId
 * @param {string} mailId
 * @param {object} updates - The updates to apply to the mail
 * @returns {Promise<Mail>} - The updated mail object.
 * @throws {Error} If the mail is invalid or update fails.
 */
export async function updateMailById(userId, mailId, updates) {
    const mail = await getMailById(userId, mailId);

    if (!mail.draft) {
        throw new Error("Only drafts can be updated");
    }

    if (updates.subject) {
        mail.subject = updates.subject;
    }
    if (updates.body) {
        mail.body = updates.body;
    }
    if (updates.recipient) {
        const recipientUser =
            (await getUserById(updates.recipient)) ||
            (await getUserByEmail(updates.recipient));
        if (recipientUser) {
            mail.recipient = recipientUser.id;
        } else {
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

        const recipientUser =
            (await getUserById(mail.recipient)) ||
            (await getUserByEmail(mail.recipient));
        if (!recipientUser) throw new Error("Recipient not found");

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

    return mail;
}
