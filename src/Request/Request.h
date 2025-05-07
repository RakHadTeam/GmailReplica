#pragma once
#include <string>
#include <map>
#include <sstream>
#include <algorithm>

class Request {
private:
	std::string method;
	std::map<std::string, std::string> parameters;
	std::string rawdata;

	void parse();

	void parseParams(const std::string& data);

public:
	explicit Request(const std::string& rawdata);

	Request(const std::string& method, const std::string& path, const std::map<std::string, std::string>& params);

	std::string toString() const;

	std::string getMethod() const;

	std::map<std::string, std::string> getParameters() const;

	std::string getRawData() const;
};