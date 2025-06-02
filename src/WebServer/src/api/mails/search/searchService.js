import { getUserById } from "../../users/userService.js";
import globals from "../../../core/globals.js";

export function searchMails(token, query) {
    const user = getUserById(token);
    if (!user) {
        return { status: 401 };
    }
    return user.mails.filter(
        (mailIndex) =>
            (globals.mails[mailIndex].subject &&
                globals.mails[mailIndex].subject
                    .toLowerCase()
                    .includes(query)) ||
            (globals.mails[mailIndex].body &&
                globals.mails[mailIndex].body.toLowerCase().includes(query)) ||
            (globals.mails[mailIndex].recipient &&
                globals.mails[mailIndex].recipient
                    .toLowerCase()
                    .includes(query))
    );
}
