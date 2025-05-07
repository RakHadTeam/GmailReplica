#include <Commands/ICommand.h>
#include <Commands/AddURLCommand/AddURLCommand.h>
#include <string>
#include <memory>
#include <IO/Input/IInput.h>
#include <BloomFilter/BloomFilter.h>

// Constructor implementation
AddURLCommand::AddURLCommand(BloomFilter& bf, std::shared_ptr<IInput> inp, std::shared_ptr<IDBSaver> db)
    : bloomFilter(bf), input(inp), dbSaver(db) {
}


// Execute the command
void AddURLCommand::execute(std::shared_ptr<Request> request) {
	// Get URL:
	std::string url;
	url = request->getParameters().at("url");

	if (url.empty()) {
		return;
	}

	bloomFilter.add(url);

	// Response (Method:ADDURL)

	//output.displayResponse(this, true);
}