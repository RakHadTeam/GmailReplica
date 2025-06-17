#include <Commands/AddURLCommand/AddURLCommand.h>

// Constructor implementation
AddURLCommand::AddURLCommand(BloomFilter& bf)
	: bloomFilter(bf) {
}


// Execute the command
std::shared_ptr<Response> AddURLCommand::execute(std::shared_ptr<Request> request) {
	// Get URL:
	std::string url;
	url = request->getParameter("url");

	if (url.empty()) {
		return std::make_shared<Response>(StatusCode::BAD_REQUEST);
	}

	bloomFilter.add(url);

	return std::make_shared<Response>(StatusCode::CREATED);
}