// Commands/DeleteURLCommand/DeleteURLCommand.h
#pragma once

#include <Commands/ICommand.h>
#include <IO/Input/IInput.h>
#include <IO/Output/IOutput.h>
#include <BloomFilter/BloomFilter.h>

class DeleteURLCommand : public ICommand {
public:
    DeleteURLCommand(BloomFilter& bloomFilter);

	std::shared_ptr<Response> execute(std::shared_ptr<Request> request) override;


private:
    BloomFilter& bloomFilter;
};
