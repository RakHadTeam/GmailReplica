#include "ICommand.h"
#include <string>
#include "IInput.h"
#include <unordered_set>
#include "IOutput.h"
// Command that checks if a given URL exists in the Bloom Filter
class CheckURLCommand : public ICommand {
private:
	BloomFilter& bloomFilter;
	IInput* input;
	IOutput* output;
public:
	// Constructor initializes members
	CheckURLCommand(BloomFilter& bloomFilter, IInput* input, IOutput* output)
		: bloomFilter(bloomFilter), input(input), output(output) {
	}

	void execute() override {
		std::string url;
		input->getURL(url);  // Get URL from input
		if (url.empty())
			return;

		//TODO: put instad the false a false positive from function
		output->displayCheckURLResult(bloomFilter.contains(url), false);

	}
};