#include <IO/Input/STDInput/STDInput.h>

std::shared_ptr<Request> STDInput::getRequest() {
	// Get the method
	std::string method;
	std::cin >> method;
	// Get the url
	std::string url;
	std::cin >> url;

	std::map<std::string, std::string> params;
	params["url"] = url;

	auto request = std::make_shared<Request>(method, params);
	return request;
}