import net from "net";

/** * Sends a command to the blacklist server and returns the response.
 * @param {string} command - The command to send to the blacklist server.
 * @returns {Promise<number>} - A promise that resolves with the response code from the server.
 */

export async function sendBlacklistCommand(command) {
    return new Promise((resolve, reject) => {
        const clientSocket = net.createConnection(
            {
                host: process.env.BLACKLIST_HOST,
                port: process.env.BLACKLIST_PORT,
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
