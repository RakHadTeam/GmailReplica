import globals from "../core/globals.js";
import { getUserById } from "./user.model.js";
import { getUserIdFromToken } from "../core/jwt.js";

export function searchMails(userId, query) {
    const user = getUserById(userId);
    if (!user) {
        return { status: 401, error: "Unauthorized" };
    }

    const filteredMails = user.mails
        .filter(
            (mailIndex) =>
                (globals.mails[mailIndex].subject &&
                    globals.mails[mailIndex].subject
                        .toLowerCase()
                        .includes(query)) ||
                (globals.mails[mailIndex].body &&
                    globals.mails[mailIndex].body
                        .toLowerCase()
                        .includes(query)) ||
                (globals.mails[mailIndex].recipient &&
                    globals.mails[mailIndex].recipient
                        .toLowerCase()
                        .includes(query))
        )
        .map((mailIndex) => globals.mails[mailIndex]);

    // delete duplicate mails
    const uniqueMails = Array.from(
        new Map(filteredMails.map((mail) => [mail.id, mail])).values()
    );

    return { status: 200, mails: uniqueMails };
}
