#include <Request/Request.h>

#define HTTP_VERSION "HTTP/1.1"

Request::Request(const std::string& rawdata) : rawdata(rawdata) {
	parse();
}

void Request::parse() {
	std::istringstream stream(rawdata);
	std::string line;

	// METHOD /path?query HTTP/1.1
	if (std::getline(stream, line)) {
		std::istringstream linestream(line);
		std::string path;
		linestream >> method >> path;

		// Extract parameters from URL query string
		size_t query_pos = path.find('?');
		if (query_pos != std::string::npos) {
			std::string query = path.substr(query_pos + 1);
			parseParams(query);
		}
	}

	// Skip headers until empty line
	while (std::getline(stream, line) && line != "\r" && !line.empty());

	// Read body
	std::string body;
	while (std::getline(stream, line)) {
		body += line;
	}
	parseParams(body);
}

void Request::parseParams(const std::string& data) {
	std::string input = data;
	size_t pos = 0;
	while ((pos = input.find('&')) != std::string::npos) {
		std::string token = input.substr(0, pos);
		input.erase(0, pos + 1);

		size_t eq_pos = token.find('=');
		if (eq_pos != std::string::npos) {
			std::string key = token.substr(0, eq_pos);
			std::string value = token.substr(eq_pos + 1);
			parameters[key] = value;
		}
	}
	size_t eq_pos = input.find('=');
	if (eq_pos != std::string::npos) {
		std::string key = input.substr(0, eq_pos);
		std::string value = input.substr(eq_pos + 1);
		parameters[key] = value;
	}
}

Request::Request(const std::string& method, const std::string& path, const std::map<std::string, std::string>& params)
	: method(method), parameters(params) {
	std::ostringstream oss;
	oss << method << " " << path << " " << HTTP_VERSION << "\r\n";
	for (const auto& param : params) {
		oss << param.first << "=" << param.second << "&";
	}
	rawdata = oss.str();
}

std::map<std::string, std::string> Request::getParameters() const {
	return parameters;
}
std::string Request::getMethod() const {
	return method;
}
std::string Request::getRawData() const {
	return rawdata;
}