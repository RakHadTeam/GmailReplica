#pragma once
#include <string>
#include <TCPServer/StatusCode.h>

class Response {
private:
	StatusCode status;
	std::string payload;
		
public: 

	explicit Response(StatusCode status, const std::string& payload);

	StatusCode getStatus() const;

	std::string getRawData() const;
};