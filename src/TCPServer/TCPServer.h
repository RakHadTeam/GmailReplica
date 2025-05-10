#pragma once

#include <atomic>
#include <thread>
#include <vector>
#include <mutex>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <cerrno>
#include <cstring>
#include <iostream>
#include <thread>

#define MIN_PORT 0
#define MAX_PORT 65535
#define BACKLOG 5
#define BUFFER_SIZE 4096


class TCPServer {
public:
	TCPServer();
	~TCPServer();

	bool startServer(int portNumber);
	void shutdown();
	int getPort() const;

protected:
	virtual void handleClient(int clientSock);

private:
	void acceptLoop();

	int serverSocket;
	int port;
	std::atomic<bool> running;
	std::vector<std::thread> threads;
	std::mutex guard;
};
