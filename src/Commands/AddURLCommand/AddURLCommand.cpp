#include <Commands/ICommand.h>
#include <Commands/AddURLCommand/AddURLCommand.h>
#include <string>
#include <memory>
#include <IO/Input/IInput.h>
#include <BloomFilter/BloomFilter.h>

// Constructor implementation
AddURLCommand::AddURLCommand(BloomFilter& bf, std::shared_ptr<IInput> inp, std::shared_ptr<IOutput> out, std::shared_ptr<IDBSaver> db)
    : bloomFilter(bf), input(inp), output(out), dbSaver(db) {
}


// Execute the command
void AddURLCommand::execute(std::shared_ptr<Request> request) {
	// Get URL:
	std::string url;
	url = request->getParameter("url");

	if (url.empty()) {
		output->sendResponse(std::make_shared<Response>(StatusCode::BAD_REQUEST));
		return;
	}

	bloomFilter.add(url);

	output->sendResponse(std::make_shared<Response>(StatusCode::CREATED));
}