#pragma once
#include <Request/Request.h>
#include <memory>

class ICommand {
public:
	virtual void execute(std::shared_ptr<Request> request) = 0;
};