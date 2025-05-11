#include <Request/Request.h>

Request::Request(const std::string& method, const std::map<std::string, std::string>& params)
	: method(method), parameters(params) {}

std::map<std::string, std::string> Request::getParameters() const {
	return parameters;
}
std::string Request::getMethod() const {
	return method;
}

std::string Request::getParameter(const std::string& key) const {
	return parameters.at(key);
}