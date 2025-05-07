#pragma once

#include <atomic>
#include <thread>
#include <vector>
#include <mutex>

class TCPServer {
public:
    TCPServer();
    ~TCPServer();

    // Bind to the given port and start accepting clients.
    // Returns false on any failure.
    bool startServer(int portNumber);

    // Stop accepting, close the listen socket, and join all client threads.
    void shutdown();

    // After a successful startServer(), returns the port you bound to.
    int getPort() const;

protected:
    // Override this in a subclass to do something useful with each client socket.
    virtual void handleClient(int clientSock);

private:
    // The loop that sits in accept() and spins off handleClient() threads.
    void acceptLoop();

    int                          serverSocket;  // the listening socket FD
    int                          port;          // port we bound to
    std::atomic<bool>            running;       // true while acceptLoop should run
    std::vector<std::thread>     threads;       // threads for acceptLoop + each client
    std::mutex                   guard;         // protects 'threads' vector
};
