#include <TCPServer/TCPServer.h>

TCPServer::TCPServer() : serverSocket(-1), port(0), running(false) {}

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

	if (::bind(serverSocket, static_cast<sockaddr*>(static_cast<void*>(&addr)), sizeof(addr)) < 0) {
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
		socklen_t len = sizeof(actual);
		if (::getsockname(serverSocket, static_cast<sockaddr*>(static_cast<void*>(&actual)), &len) == 0) {
			port = ntohs(actual.sin_port);
		}
		else {
			port = portNumber;
		}
	}

	running = true;

	{
		std::scoped_lock<std::mutex> lk(guard);
		threads.emplace_back(&TCPServer::acceptLoop, this);
	}

	std::cout << "[Info] Server started on port " << port << "\n";
	return true;
}

void TCPServer::acceptLoop() {
	while (running) {
		sockaddr_in clientAddr;
		socklen_t len = sizeof(clientAddr);

		int clientSock = ::accept(serverSocket, static_cast<sockaddr*>(static_cast<void*>(&clientAddr)), &len);
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

	// TCPInput input(clientSock);

	// auto addURLCommand = std::make_shared<AddURLCommand>(bloomFilter, input, output, dbSaver);
	// commands["POST"] = addURLCommand;

	// auto checkURLCommand = std::make_shared<CheckURLCommand>(bloomFilter, input, output);
	// commands["GET"] = checkURLCommand;

	// App app(commands, input);

	// // app.run();

}

void TCPServer::shutdown() {
	if (!running.exchange(false)) return;

	::shutdown(serverSocket, SHUT_RDWR);
	::close(serverSocket);

	{
		std::scoped_lock lock(guard);
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
