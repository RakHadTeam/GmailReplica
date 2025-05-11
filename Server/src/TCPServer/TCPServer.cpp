#include <TCPServer/TCPServer.h>

TCPServer::TCPServer(std::map<std::string, std::shared_ptr<ICommand>>& commands)
	: serverSocket(-1), port(0), running(false), commands(commands) {
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
		return false;
	}

	sockaddr_in addr{};
	addr.sin_family = AF_INET;
	addr.sin_addr.s_addr = INADDR_ANY;
	addr.sin_port = htons(static_cast<uint16_t>(portNumber));

	if (::bind(serverSocket, static_cast<sockaddr*>(static_cast<void*>(&addr)), sizeof(addr)) < 0) {
		::close(serverSocket);
		return false;
	}

	if (::listen(serverSocket, 5) < 0) {
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

	acceptLoop();

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

	std::shared_ptr<TCPInput> input = std::make_shared<TCPInput>(clientSock);

	std::shared_ptr<IOutput> output = std::make_shared<TCPOutput>(clientSock);

	App app(commands, input, output);

	app.run();

	std::cout << "[Info] Client socket " << clientSock << " closed\n";
	::close(clientSock);
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
