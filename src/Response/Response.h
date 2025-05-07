#pragma once
#include <string>
#include <TCPServer/StatusCode.h>

class Response {
private:
	StatusCode status;
		
public: 

	explicit Response(StatusCode status);

	StatusCode getStatus() const;

	std::string getRawData() const;
};