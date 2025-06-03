import net from "net";
import globals from "../../core/globals.js";

export function sendBlacklistCommand(command) {
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

export function addURLToBlacklist(url) {
    return sendBlacklistCommand(`POST ${url}`);
}

export function deleteURLFromBlacklist(id) {
    return sendBlacklistCommand(`DELETE ${id}`);
}
