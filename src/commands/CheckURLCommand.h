#pragma once

#include "ICommand.h"
#include "../IO/Input/IInput.h"
#include "../IO/Output/IOutput.h"
#include "../BloomFilter/BloomFilter.h"
#include <memory>
#include <string>

// The CheckURLCommand class implements the ICommand interface to check if a URL is in the Bloom filter.
class CheckURLCommand : public ICommand {
private:
	BloomFilter& bloomFilter; // Reference to the Bloom filter
	std::shared_ptr<IInput> input; // Input handler
	std::shared_ptr<IOutput> output; // Output handler

public:
	// Constructor
	CheckURLCommand(BloomFilter& bloomFilter, std::shared_ptr<IInput> input, std::shared_ptr<IOutput> output);

	// Execute the command
	void execute() override;
};