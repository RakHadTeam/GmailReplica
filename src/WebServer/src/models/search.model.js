// src/models/search.model.js
import globals from "../core/globals.js";
import { getUserById } from "./user.model.js";

export function searchMails(userId, query) {
  const user = getUserById(userId);
  if (!user) {
    return { status: 401, error: "Unauthorized" };
  }

  const lowerQ = query.toLowerCase();

  const filteredMails = user.mails
    .map((mailIndex) => globals.mails[mailIndex])
    .filter((mail) => {
      // subject/body/id checks
      const subj  = mail.subject?.toLowerCase().includes(lowerQ);
      const body  = mail.body?.toLowerCase().includes(lowerQ);
      const rId   = mail.recipient?.toLowerCase().includes(lowerQ);

      // lookup the recipient user
      const recUser = getUserById(mail.recipient) || {};
      const rName  = recUser.fullname?.toLowerCase().includes(lowerQ);
      const rEmail = recUser.email?.toLowerCase().includes(lowerQ);

      return subj || body || rId || rName || rEmail;
    });

  // dedupe by mail.id
  const uniqueMails = Array.from(
    new Map(filteredMails.map((m) => [m.id, m])).values()
  );

  return { status: 200, mails: uniqueMails };
}
