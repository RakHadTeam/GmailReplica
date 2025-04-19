#include "ICommand.h"
#include <string>
#include <memory>
#include "../IO/Input/IInput.h"
#include "../BloomFilter/BloomFilter.cpp"

class AddURLCommand : public ICommand {
private:
	BloomFilter& bloomFilter;
	std::shared_ptr<IInput> input;
public:
	AddURLCommand(BloomFilter& bf, std::shared_ptr<IInput> inp) : bloomFilter(bf), input(inp) {}
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