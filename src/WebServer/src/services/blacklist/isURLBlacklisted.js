import { sendBlacklistCommand } from "./sendBlacklistCommand.js";

/** * Checks if a URL is blacklisted.
 * @param {string} url - The URL to check.
 * @returns {Promise<number>} - A promise that resolves with the response code from the server.
 */
export function isURLBlacklisted(url) {
    return sendBlacklistCommand(`GET ${url}`);
}
