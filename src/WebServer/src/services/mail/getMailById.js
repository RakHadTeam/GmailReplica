import { NotFoundError, UnauthorizedError } from "../../core/errors/AppError.js";
import Mail from "../../models/mail.model.js";
import { getUserById } from "../user/getUserById.js";

/**
 * Get a mail by its ID for a specific user.
 * @param {string} userId
 * @param {string} id
 * @returns {Promise<Mail>} - The requested mail object.
 * @throws {NotFoundError|UnauthorizedError} If the user or mail is not found or unauthorized.
 */
export async function getMailById(userId, id) {
    const user = await getUserById(userId);

    const mail = await Mail.findById(id);
    if (!mail) throw new NotFoundError("Mail not found");

    if (!user.mails.includes(mail.id))
        throw new UnauthorizedError("Unauthorized access to this mail");

    return mail;
}
