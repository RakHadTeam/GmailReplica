#pragma once
#include <Commands/ICommand.h>
#include <Response/Response.h>
#include <memory>

class IOutput {
public:
	virtual void sendResponse(std::shared_ptr<Response> res) = 0;
	virtual ~IOutput() = default;
};