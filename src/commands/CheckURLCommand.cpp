#include "ICommand.h"
#include <string>
#include "../IO/Input/IInput.h"
#include <unordered_set>
#include "../IO/Output/IOutput.h"

class CheckURLCommand : public ICommand {
private:
	BloomFilter& bloomFilter;
	IInput* input;
	IOutput* output;
public:

	CheckURLCommand(BloomFilter& bloomFilter, IInput* input, IOutput* output)
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