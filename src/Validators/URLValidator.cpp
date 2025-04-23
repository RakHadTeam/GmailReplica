#include "URLValidator.h"
#include <regex>

bool URLValidator::isValid(const std::string& url) {
    const std::regex urlRegex(
        R"(^((https?|ftp):\/\/)?([a-zA-Z0-9-]+\.){2,}[a-zA-Z0-9-]+$)",
        std::regex::icase
    );
    return std::regex_match(url, urlRegex);
}
