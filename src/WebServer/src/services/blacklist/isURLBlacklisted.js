import StatusCode from "../../core/StatusCode.js";
import { sendBlacklistCommand } from "./sendBlacklistCommand.js";

/** * Checks if a URL is blacklisted.
 * @param {string} url - The URL to check.
 * @returns {Promise<number>} - A promise that resolves with the response code from the server.
 */
export async function isURLBlacklisted(url) {
    const res = await sendBlacklistCommand(`GET ${url}`);
    return res == StatusCode.OK;
}
