#include <Response/Response.h>

Response::Response(StatusCode status, const std::string& payload) : status(status), payload(payload) {}

Response::Response(StatusCode status) : status(status), payload("") {}

StatusCode Response::getStatus() const {
	return status;
}

std::string Response::getPayload() const {
	return payload;
}
