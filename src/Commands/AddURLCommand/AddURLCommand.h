#pragma once

#include <Commands/ICommand.h>
#include <IO/Input/IInput.h>
#include <BloomFilter/BloomFilter.h>
#include <memory>
#include <string>
#include <iostream>

// The AddURLCommand class implements the ICommand interface to add a URL to the Bloom filter.
class AddURLCommand : public ICommand {
	private:
		BloomFilter& bloomFilter;
		std::shared_ptr<IInput> input;
		std::shared_ptr<IDBSaver> dbSaver;
	
	public:
		AddURLCommand(BloomFilter& bf, std::shared_ptr<IInput> inp, std::shared_ptr<IDBSaver> dbSaver);
	
		void execute(std::shared_ptr<Request> request) override;
	};
	