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

    
    // Check if user has mails
    if (!user.mails || !Array.isArray(user.mails)) {
        return [];
    }
    
    // Handle empty or whitespace-only queries
    if (!query || query.trim().length === 0) {
        return [];
    }

    const lowerQ = query.toLowerCase().trim();

    const filteredMails = user.mails.filter((mail) => {
        // Search in subject
        const subj =
            mail.subject && mail.subject.toLowerCase().includes(lowerQ);

        // Search in body
        const body = mail.body && mail.body.toLowerCase().includes(lowerQ);

        // Search in recipient ID (if recipient is a string ObjectId)
        const rId =
            typeof mail.recipient === "string" && mail.recipient
                ? mail.recipient.toLowerCase().includes(lowerQ)
                : false;

        // Search in recipient name (if recipient is populated object)
        const rName =
            mail.recipient && mail.recipient.fullname
                ? mail.recipient.fullname.toLowerCase().includes(lowerQ)
                : false;

        // Search in recipient email (if recipient is populated object)
        const rEmail =
            mail.recipient && mail.recipient.email
                ? mail.recipient.email.toLowerCase().includes(lowerQ)
                : false;


        return subj || body || rId || rName || rEmail;
    });

    filteredMails.forEach((mail) => {
        if (mail.recipient && typeof mail.recipient === "object") {
            mail.recipient = mail.recipient._id;
        }
    });

    return filteredMails;
}
