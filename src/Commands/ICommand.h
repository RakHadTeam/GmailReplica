#pragma once
#include <Request/Request.h>
#include <memory>
#include <Response/Response.h>

class ICommand {
public:
	virtual std::shared_ptr<Response> execute(std::shared_ptr<Request> request) = 0;
};