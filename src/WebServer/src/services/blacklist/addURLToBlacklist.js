import { sendBlacklistCommand } from "./sendBlacklistCommand.js";

/** * Adds a URL to the blacklist.
 * @param {string} url - The URL to add to the blacklist.
 * @returns {Promise<number>} - A promise that resolves with the response code from the server.
 */

export function addURLToBlacklist(url) {
    return sendBlacklistCommand(`POST ${url}`);
}
