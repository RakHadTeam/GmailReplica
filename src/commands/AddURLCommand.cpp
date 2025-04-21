#include "ICommand.h"
#include "AddURLCommand.h"
#include <string>
#include <memory>
#include "../IO/Input/IInput.h"
#include "../BloomFilter/BloomFilter.h"

// Constructor implementation
AddURLCommand::AddURLCommand(BloomFilter& bf, std::shared_ptr<IInput> inp)
	: bloomFilter(bf), input(inp) {
}

// Execute the command
void AddURLCommand::execute() {
	// Get URL:
	std::string url;
	url = input->getURL();

	if (url.empty()) {
		return;
	}

	// Print URL:
	std::cout << "Adding URL: " << url << std::endl;

	bloomFilter.add(url);
}