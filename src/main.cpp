#include <string>
#include "BloomFilter/BloomFilter.cpp"
#include "commands/AddURLCommand.cpp"
#include "IO/Input/STDInput.cpp"
#include <map>
#include <memory>
#include "App.cpp"
#include "IO/Input/IInput.h"
#include "commands/CheckURLCommand.cpp"
#include "IO/Output/STDOutput.cpp"

int main()
{
	std::shared_ptr<STDInput> input = std::make_shared<STDInput>();
	std::shared_ptr<STDOutput> output = std::make_shared<STDOutput>();

	int bitArraySize = input->getSizeOfArray();

	std::vector<std::shared_ptr<IHashFunction>> hashFunctions;
	input->setHashFunctions(hashFunctions);

	BloomFilter bloomFilter(bitArraySize, hashFunctions);

	std::map<std::string, std::shared_ptr<ICommand>> commands;

	std::shared_ptr<AddURLCommand> addURLCommand = std::make_shared<AddURLCommand>(bloomFilter, input);
	commands["1"] = addURLCommand;

	std::shared_ptr<CheckURLCommand> checkURLCommand = std::make_shared<CheckURLCommand>(bloomFilter, input, output);
	commands["2"] = checkURLCommand;

	App app(commands, input);
	app.run();

	return 0;
}