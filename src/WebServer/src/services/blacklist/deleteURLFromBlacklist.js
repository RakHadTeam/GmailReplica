import { sendBlacklistCommand } from "./sendBlacklistCommand.js";

/** * Deletes a URL from the blacklist.
 * @param {string} id - The ID of the URL to delete from the blacklist.
 * @returns {Promise<number>} - A promise that resolves with the response code from the server.
 */

export function deleteURLFromBlacklist(id) {
    return sendBlacklistCommand(`DELETE ${id}`);
}
