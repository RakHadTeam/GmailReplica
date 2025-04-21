#include "URLValidator.h"
#include <regex>

bool URLValidator::isValid(const std::string& url) {
	const std::regex urlRegex(R"(^[^\s.]+\.[^\s.]+\.[^\s.]+$)");
	return std::regex_match(url, urlRegex);
}