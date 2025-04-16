#include "ICommand.h"
#include <string>
#include "Input.h"

class AddCommand : public ICommand {
private:
	BloomFilter& bloomFilter;
	Input* input;
public:
	AddCommand(BloomFilter& bf, Input* inp) : bloomFilter(bf), input(inp) {}
	void execute() override {

		// Get URL:
		std::string url;
		input->getURL(url);

		if (url.empty()) {
			return;
		}

		// Print URL:
		std::cout << "Adding URL: " << url << std::endl;

		bloomFilter.add(url);
	}

};