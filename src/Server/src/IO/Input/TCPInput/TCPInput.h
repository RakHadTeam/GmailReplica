#pragma once

#include <vector>
#include <memory>
#include <string>
#include <IO/Input/IInput.h>
#include <BloomFilter/HashFunction/STDHash/STDHash.h>
#include <Validators/URLValidator/URLValidator.h>
#include <TCPServer/TCPServer.h>
#include <algorithm>

class TCPInput : public IInput {
private:
	int clientSocket; // Socket file descriptor
public:
	// Constructor
	TCPInput(int clientSocket);
	// Get a request from the user
	std::shared_ptr<Request> getRequest() override;
};