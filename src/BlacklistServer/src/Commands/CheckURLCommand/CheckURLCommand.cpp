#include <Commands/CheckURLCommand/CheckURLCommand.h>

// Constructor implementation
CheckURLCommand::CheckURLCommand(BloomFilter& bloomFilter)
	: bloomFilter(bloomFilter) {
}

// Execute the command
std::shared_ptr<Response> CheckURLCommand::execute(std::shared_ptr<Request> request) {
	std::string url;

	url = request->getParameter("url");

	if (url.empty()) {
		return std::make_shared<Response>(StatusCode::BAD_REQUEST);
	}

	// Check if the URL is in the Bloom filter
	if (bloomFilter.containsInArray(url)) {
		if (bloomFilter.containsInDB(url)) {
			return std::make_shared<Response>(StatusCode::OK, "true true");
		}
		else {
			return std::make_shared<Response>(StatusCode::NOT_FOUND, "true false");
		}

	}
	else {
		return std::make_shared<Response>(StatusCode::NOT_FOUND, "false");
	}

}