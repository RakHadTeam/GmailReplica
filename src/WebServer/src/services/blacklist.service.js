import net from "net";
import globals from "../core/globals.js";

/** * Sends a command to the blacklist server and returns the response.
 * @param {string} command - The command to send to the blacklist server.
 * @returns {Promise<number>} - A promise that resolves with the response code from the server.
 */
export async function sendBlacklistCommand(command) {
    return new Promise((resolve, reject) => {
        const clientSocket = net.createConnection(
            {
                host: globals.blacklistServer.host,
                port: globals.blacklistServer.port,
            },
            () => {
                const encodedMessage = Buffer.from(`${command}\n`, "utf-8");
                const CHUNK_SIZE = 4096;

                for (let i = 0; i < encodedMessage.length; i += CHUNK_SIZE) {
                    clientSocket.write(
                        encodedMessage.subarray(i, i + CHUNK_SIZE)
                    );
                }
            }
        );

        let response = "";

        clientSocket.on("data", (chunk) => {
            response += chunk.toString("utf-8");
            if (response.endsWith("\n")) {
                clientSocket.end(); // Close the connection after receiving the full response
            }
        });

        clientSocket.on("end", () => {
            const resParts = response.split(" ");
            resolve(parseInt(resParts[0], 10));
        });

        clientSocket.on("error", (err) => {
            reject(err);
        });
    });
}

/** * Adds a URL to the blacklist.
 * @param {string} url - The URL to add to the blacklist.
 * @returns {Promise<number>} - A promise that resolves with the response code from the server.
 */
export function addURLToBlacklist(url) {
    return sendBlacklistCommand(`POST ${url}`);
}

/** * Deletes a URL from the blacklist.
 * @param {string} id - The ID of the URL to delete from the blacklist.
 * @returns {Promise<number>} - A promise that resolves with the response code from the server.
 */
export function deleteURLFromBlacklist(id) {
    return sendBlacklistCommand(`DELETE ${id}`);
}

/** * Checks if a URL is blacklisted.
 * @param {string} url - The URL to check.
 * @returns {Promise<number>} - A promise that resolves with the response code from the server.
 */
export function isURLBlacklisted(url) {
    return sendBlacklistCommand(`GET ${url}`);
}

/** * Extracts all links from the body of an email.
 * @param {string} body - The body of the email.
 * @returns {string[]} - An array of links found in the body.
 */
export function getAllLinksFromBody(body) {
    const urlRegex =
        /((https?|ftp):\/\/)?([a-zA-Z0-9-]+\.){1,2}[a-zA-Z0-9-]+/gi;
    const links = [];
    let match;
    while ((match = urlRegex.exec(body)) !== null) {
        links.push(match[0]);
    }
    return links;
}