import net from "net";
import globals from "../../core/globals.js";

export async function addURLToBlacklist(url) {
    return new Promise((resolve, reject) => {
        const client = net.createConnection(globals.blacklistServer, () => {
            const message = `POST ${url}\n`;
            const encodedMessage = Buffer.from(message, "utf-8");

            const CHUNK_SIZE = 4096;
            for (let i = 0; i < encodedMessage.length; i += CHUNK_SIZE) {
                client.write(encodedMessage.subarray(i, i + CHUNK_SIZE));
            }
        });

        let response = "";

        client.on("data", (data) => {
            response += data.toString();
            if (response.endsWith("\n")) {
                const resParts = response.trim().split(" ");
                const statusCode = parseInt(resParts[0], 10) || 500;
                client.end();
                resolve(statusCode);
            }
        });

        client.on("error", (err) => {
            client.end();
            reject(err);
        });
    });
}

export async function deleteURLFromBlacklist(id) {
    return new Promise((resolve, reject) => {
        const client = net.createConnection(globals.blacklistServer, () => {
            const message = `DELETE ${id}\n`;
            const encodedMessage = Buffer.from(message, "utf-8");

            const CHUNK_SIZE = 4096;
            for (let i = 0; i < encodedMessage.length; i += CHUNK_SIZE) {
                client.write(encodedMessage.subarray(i, i + CHUNK_SIZE));
            }
        });


        let response = "";

        client.on("data", (data) => {
            response += data.toString();
            if (response.endsWith("\n")) {
                const resParts = response.trim().split(" ");
                const statusCode = parseInt(resParts[0], 10) || 500;
                client.end();
                resolve(statusCode);
            }
        });

        client.on("error", (err) => {
            client.end();
            reject(err);
        });
    });
}
