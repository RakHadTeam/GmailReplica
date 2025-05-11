#pragma once
#include <sstream>
#include <string>
#include <TCPServer/StatusCode.h>

class Response {
private:
	StatusCode status;
	std::string payload;
		
public: 

	explicit Response(StatusCode status, const std::string& payload);
	explicit Response(StatusCode status);

	StatusCode getStatus() const;

	std::string getPayload() const;
};