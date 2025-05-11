#pragma once
#include <string>
#include <map>
#include <vector>
#include <sstream>

class Request {
private:
	std::string method;
	std::map<std::string, std::string> parameters;

public:
	Request(const std::string& method, const std::map<std::string, std::string>& params);

	std::string getMethod() const;

	std::map<std::string, std::string> getParameters() const;

	std::string getParameter(const std::string& key) const;
};