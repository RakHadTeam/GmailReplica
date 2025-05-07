#pragma once
#include <atomic>

class TCPServer {
public:
    TCPServer() : port(0), running(false) {}

    // Start the server; now it returns a boolean
    bool startServer(int portNumber) {
        port = portNumber;
        running = true;
        return true;
    }

    // Simulated shutdown
    void shutdown() {
        running = false;
    }

    // Getter for the port
    int getPort() const {
        return port;
    }

    // This should be virtual to be overridden in tests
    virtual void handleClient(int clientSock) {
        // Original behavior of handling a client
    }

protected:
    int port;
    std::atomic<bool> running;
};
