#pragma once

#include <Commands/ICommand.h>
#include <IO/Input/IInput.h>
#include <IO/Output/IOutput.h>
#include <BloomFilter/BloomFilter.h>
#include <memory>
#include <string>

// The CheckURLCommand class implements the ICommand interface to check if a URL is in the Bloom filter.
class CheckURLCommand : public ICommand {
private:
	BloomFilter& bloomFilter; // Reference to the Bloom filter

public:
	// Constructor
	CheckURLCommand(BloomFilter& bloomFilter);

	// Execute the command
	std::shared_ptr<Response> execute(std::shared_ptr<Request> request) override;
};