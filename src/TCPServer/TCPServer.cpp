#include "TCPServer.h"
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <cerrno>
#include <cstring>
#include <iostream>
#include <thread>

const int MIN_PORT = 0;
const int MAX_PORT = 65535;
const int BACKLOG = 5;

TCPServer::TCPServer()
	: serverSocket(-1)
	, port(0)
	, running(false)
{
}

TCPServer::~TCPServer() {
	shutdown();
}

bool TCPServer::startServer(int portNumber) {
	if (portNumber < MIN_PORT || portNumber > MAX_PORT) {
		std::cerr << "[Error] Invalid port: " << portNumber << "\n";
		return false;
	}

	serverSocket = ::socket(AF_INET, SOCK_STREAM, 0);
	if (serverSocket < 0) {
		std::cerr << "[Error] socket(): " << std::strerror(errno) << "\n";
		return false;
	}

	sockaddr_in addr{};
	addr.sin_family = AF_INET;
	addr.sin_addr.s_addr = INADDR_ANY;
	addr.sin_port = htons(static_cast<uint16_t>(portNumber));

	if (::bind(serverSocket,
		reinterpret_cast<sockaddr*>(&addr),
		sizeof(addr)) < 0)
	{
		std::cerr << "[Error] bind(): " << std::strerror(errno) << "\n";
		::close(serverSocket);
		return false;
	}

	if (::listen(serverSocket, BACKLOG) < 0) {
		std::cerr << "[Error] listen(): " << std::strerror(errno) << "\n";
		::close(serverSocket);
		return false;
	}

	{
		sockaddr_in actual{};
		socklen_t   len = sizeof(actual);
		if (::getsockname(serverSocket,
			reinterpret_cast<sockaddr*>(&actual),
			&len) == 0)
		{
			port = ntohs(actual.sin_port);
		}
		else {
			port = portNumber;
		}
	}

	running = true;
	{
		std::lock_guard<std::mutex> lk(guard);
		threads.emplace_back(&TCPServer::acceptLoop, this);
	}

	std::cout << "[Info] Server started on port " << port << "\n";
	return true;
}

void TCPServer::acceptLoop() {
	while (running) {
		sockaddr_in clientAddr;
		socklen_t   len = sizeof(clientAddr);

		int clientSock = ::accept(serverSocket,
			reinterpret_cast<sockaddr*>(&clientAddr),
			&len);
		if (clientSock < 0) {
			if (!running) break;
			std::cerr << "[Error] accept(): " << std::strerror(errno) << "\n";
			continue;
		}

		handleClient(clientSock);

		::close(clientSock);
	}
}

void TCPServer::handleClient(int /*clientSock*/) {
	// Default does nothing. Override in subclass.
}

void TCPServer::shutdown() {
	if (!running.exchange(false)) return;

	::shutdown(serverSocket, SHUT_RDWR);
	::close(serverSocket);

	{
		std::lock_guard<std::mutex> lk(guard);
		for (auto& t : threads) {
			if (t.joinable()) t.join();
		}
		threads.clear();
	}

	std::cout << "[Info] Server stopped\n";
}

int TCPServer::getPort() const {
	return port;
}
