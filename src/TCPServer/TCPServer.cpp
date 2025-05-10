// src/TCPServer/TCPServer.cpp

#include "TCPServer.h"

// POSIX sockets
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>

// C lib
#include <cerrno>
#include <cstring>

// C++ std
#include <iostream>
#include <thread>

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
	if (portNumber < 0 || portNumber > 65535) {
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

	if (::listen(serverSocket, 5) < 0) {
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

		std::lock_guard<std::mutex> lk(guard);
		threads.emplace_back(&TCPServer::handleClient, this, clientSock);
	}
}

void TCPServer::handleClient(int clientSock) {
	std::cout << "[Info] handling client socket " << clientSock << "\n";

	char buffer[1024];
	ssize_t n = ::recv(clientSock, buffer, sizeof(buffer) - 1, 0);
	if (n < 0) {
		std::cerr << "[Error] recv(): " << std::strerror(errno) << "\n";
		::close(clientSock);
		return;
	}
	if (n == 0) {
		::close(clientSock);
		return;
	}

	buffer[n] = '\0';
	std::cout << "[Client " << clientSock << "] " << buffer;

	std::string req(buffer);
	std::string resp;
	if (req.rfind("GET /ping ", 0) == 0) {
		resp = "HTTP/1.1 200 OK\r\n"
			"Content-Length: 4\r\n"
			"Connection: close\r\n"
			"\r\n"
			"PONG";
	}
	else {
		resp = "HTTP/1.1 404 Not Found\r\n"
			"Content-Length: 9\r\n"
			"Connection: close\r\n"
			"\r\n"
			"Not Found";
	}

	::send(clientSock, resp.data(), resp.size(), 0);
	::close(clientSock);
	std::cout << "[Info] Client socket " << clientSock << " closed.\n";
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
