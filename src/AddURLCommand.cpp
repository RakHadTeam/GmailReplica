#include "ICommand.h"
#include <string>
#include "IInput.h"

class AddURLCommand : public ICommand {
private:
	BloomFilter& bloomFilter;
	IInput* input;
public:
	AddURLCommand(BloomFilter& bf, IInput* inp) : bloomFilter(bf), input(inp) {}
	void execute() override {

		// Get URL:
		std::string url;
		url = input->getURL();

		if (url.empty()) {
			return;
		}

		// Print URL:
		std::cout << "Adding URL: " << url << std::endl;

		bloomFilter.add(url);
	}

};