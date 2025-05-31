import net from 'net';

export function addURLToBlacklist(url) {
    
    // make connection to the server, on port 4545

    const client = net.createConnection({ host: 'server', port: 4545 }, () => {
        console.log('Connected to the server');
        // Send the URL to the server
        // Split the URL into chunks of 4096 bytes and send each chunk
        const message = `POST ${url}\n`;
        console.log('Sending message:', message);
        const CHUNK_SIZE = 4096;
        for (let i = 0; i < message.length; i += CHUNK_SIZE) {
            client.write(message.slice(i, i + CHUNK_SIZE));
        }
        client.end();
    });
} 