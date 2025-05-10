#include <IO/Output/TCPOutput/TCPOutput.h>

TCPOutput::TCPOutput(int clientSocket) : clientSocket(clientSocket) {}

const std::map<StatusCode, std::string> statusCodeMap = {
	{StatusCode::OK, "200 OK"},
	{StatusCode::NOT_FOUND, "404 Not Found"},
	{StatusCode::BAD_REQUEST, "400 Bad Request"},
	{StatusCode::NOT_FOUND, "403 Forbidden"}
};

void TCPOutput::sendResponse(std::shared_ptr<Response> res) {
	std::string response;
	response.append(statusCodeMap.at(res->getStatus()));
	response.append("\n");

	if(!res->getPayload().empty()) {
		response.append("\n");
		response.append(res->getPayload());
		response.append("\n");
	}

	// send it in chunks of BUFFER_SIZE
	size_t totalBytesSent = 0;
	size_t bytesToSend = response.size();
	while (totalBytesSent < bytesToSend) {
		size_t bytesLeft = bytesToSend - totalBytesSent;
		size_t chunkSize = (bytesLeft > BUFFER_SIZE) ? BUFFER_SIZE : bytesLeft;
		ssize_t bytesSent = send(clientSocket, response.c_str() + totalBytesSent, chunkSize, 0);
		if (bytesSent < 0) {
			break;
		}
		totalBytesSent += bytesSent;
	}
}