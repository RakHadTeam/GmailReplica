#include <IO/Input/TCPInput/TCPInput.h>

TCPInput::TCPInput(int clientSocket) : clientSocket(clientSocket) {
}

std::shared_ptr<Request> TCPInput::getRequest() {
	std::string buffer;
	char tmp[BUFFER_SIZE];
	while (true) {
		ssize_t bytesRead = read(clientSocket, tmp, BUFFER_SIZE);
		if (bytesRead <= 0) break;
		buffer.append(tmp, bytesRead);
		if (!buffer.empty() && buffer.back() == '\n') break; // Stop when newline is the last character
	}

	// Remove trailing newline characters
	buffer.erase(std::remove(buffer.begin(), buffer.end(), '\n'), buffer.end());

	// Check for parameters, separated by ' '
	size_t pos = buffer.find(' ');
	std::string method;
	std::string url;

	if (pos != std::string::npos) {
		method = buffer.substr(0, pos);
		url = buffer.substr(pos + 1);
	}


	std::map<std::string, std::string> parameters;

	if (URLValidator::isValid(url)) {
		parameters["url"] = url;
	}
	else {
		parameters["url"] = "";
	}

	return std::make_shared<Request>(method, parameters);
}