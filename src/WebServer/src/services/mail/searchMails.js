import { getUserById } from "../user/getUserById.js";
/**
 * Search mails belonging to a user by keyword.
 * @param {string} userId - The ID of the user performing the search.
 * @param {string} query - The search keyword.
 * @returns {Promise<Mail[]>} - An array of matched Mail documents.
 * @throws {NotFoundError} - If the user does not exist.
 */
export async function searchMails(userId, query) {
    const user = await getUserById(userId);

    await user.populate({
        path: "mails",
        populate: {
            path: "recipient",
            select: "fullname email",
        },
    });

    const lowerQ = query.toLowerCase();

    const filteredMails = user.mails.filter((mail) => {
        const subj = mail.subject?.toLowerCase().includes(lowerQ);
        const body = mail.body?.toLowerCase().includes(lowerQ);
        const rId =
            typeof mail.recipient === "string"
                ? mail.recipient?.toLowerCase().includes(lowerQ)
                : false;

        const rName =
            typeof mail.recipient === "object"
                ? mail.recipient.fullname?.toLowerCase().includes(lowerQ)
                : false;

        const rEmail =
            typeof mail.recipient === "object"
                ? mail.recipient.email?.toLowerCase().includes(lowerQ)
                : false;

        return subj || body || rId || rName || rEmail;
    });

    return filteredMails;
}
