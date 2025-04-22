#pragma once

#include "ICommand.h"
#include "../IO/Input/IInput.h"
#include "../BloomFilter/BloomFilter.h"
#include <memory>
#include <string>
#include <iostream>

// The AddURLCommand class implements the ICommand interface to add a URL to the Bloom filter.
class AddURLCommand : public ICommand {
private:
    BloomFilter& bloomFilter; // Reference to the Bloom filter
    std::shared_ptr<IInput> input; // Input handler
	std::shared_ptr<IDBSaver> dbSaver;

public:
    // Constructor
    AddURLCommand(BloomFilter& bf, std::shared_ptr<IInput> inp, std::shared_ptr<IDBSaver> dbSaver);

    // Execute the command
    void execute() override;
};