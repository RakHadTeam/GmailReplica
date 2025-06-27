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
