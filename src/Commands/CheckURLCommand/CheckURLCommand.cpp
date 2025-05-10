#include <Commands/CheckURLCommand/CheckURLCommand.h>

// Constructor implementation
CheckURLCommand::CheckURLCommand(BloomFilter& bloomFilter, std::shared_ptr<IInput> input, std::shared_ptr<IOutput> output)
	: bloomFilter(bloomFilter), input(input), output(output) {
}

// Execute the command
void CheckURLCommand::execute(std::shared_ptr<Request> request) {
	std::string url;

	url = request->getParameter("url");

	if (url.empty()) {
		output->sendResponse(std::make_shared<Response>(StatusCode::BAD_REQUEST));
		return;
	}

	// Check if the URL is in the Bloom filter
	if (bloomFilter.containsInArray(url)) {
		if (bloomFilter.containsInDB(url)) {
			output->sendResponse(std::make_shared<Response>(StatusCode::OK, "true true"));
		} else {
			output->sendResponse(std::make_shared<Response>(StatusCode::NOT_FOUND, "false false"));
		}
	
	} else {
		output->sendResponse(std::make_shared<Response>(StatusCode::NOT_FOUND, "false"));
	}
	
}