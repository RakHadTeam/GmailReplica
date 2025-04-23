#include "ICommand.h"
#include <string>
#include <memory>
#include "../IO/Input/IInput.h"
#include <unordered_set>
#include "../IO/Output/IOutput.h"
#include "../BloomFilter/BloomFilter.h"
#include "CheckURLCommand.h"

// Constructor implementation
CheckURLCommand::CheckURLCommand(BloomFilter& bloomFilter, std::shared_ptr<IInput> input, std::shared_ptr<IOutput> output)
	: bloomFilter(bloomFilter), input(input), output(output) {
}

// Execute the command
void CheckURLCommand::execute() {
	std::string url;
	url = input->getURL();
	if (url.empty())
		return;

	output->displayCheckURLResult(bloomFilter.contains(url), bloomFilter.containsInDB(url));
}