#include <IO/Input/TCPInput/TCPInput.h>

TCPInput::TCPInput(int clientSocket) : clientSocket(clientSocket) {
}

std::shared_ptr<Request> TCPInput::getRequest() {
	std::string buffer;
	char tmp[BUFFER_SIZE];
	while (true) {
		ssize_t bytesRead = ::recv(clientSocket, tmp, BUFFER_SIZE, 0);
		buffer.append(tmp, bytesRead);
		if (bytesRead < BUFFER_SIZE) break;
	}

	// Remove trailing newline characters
	buffer.erase(std::remove(buffer.begin(), buffer.end(), '\n'), buffer.end());

	std::stringstream ss(buffer);
	std::string method;
	std::string url;
	ss >> method;
	ss >> url;

	std::map<std::string, std::string> parameters;

	if (URLValidator::isValid(url)) {
		parameters["url"] = url;
	}
	else {
		parameters["url"] = "";
	}

	return std::make_shared<Request>(method, parameters);
}