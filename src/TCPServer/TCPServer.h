#pragma once

#include <atomic>
#include <thread>
#include <vector>
#include <mutex>

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

	int                          serverSocket;
	int                          port;
	std::atomic<bool>            running;
	std::vector<std::thread>     threads;
	std::mutex                   guard;
};
