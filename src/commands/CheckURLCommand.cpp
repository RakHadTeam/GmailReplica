#include "ICommand.h"
#include <string>
#include <memory>
#include "../IO/Input/IInput.h"
#include <unordered_set>
#include "../IO/Output/IOutput.h"
#include "../BloomFilter/BloomFilter.cpp"

class CheckURLCommand : public ICommand {
private:
	BloomFilter& bloomFilter;
	std::shared_ptr<IInput> input;
	std::shared_ptr<IOutput> output;
public:

	CheckURLCommand(BloomFilter& bloomFilter, std::shared_ptr<IInput> input, std::shared_ptr<IOutput> output)
		: bloomFilter(bloomFilter), input(input), output(output) {
	}

	void execute() override {
		std::string url;
		url = input->getURL();
		if (url.empty())
			return;

		//TODO: put instad the false a false positive from function
		output->displayCheckURLResult(bloomFilter.contains(url), false);

	}
};