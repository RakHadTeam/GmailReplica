#include <string>
#include "BloomFilter/BloomFilter.h"
#include "commands/AddURLCommand.h"
#include "IO/Input/STDInput.h"
#include <map>
#include <memory>
#include <filesystem>
#include "App.cpp"
#include "IO/Input/IInput.h"
#include "commands/CheckURLCommand.h"
#include "IO/Output/STDOutput.h"
#include "DB/FileDB/FileDBSaver.h"

int main()
{
	std::shared_ptr<STDInput> input = std::make_shared<STDInput>();
	std::shared_ptr<STDOutput> output = std::make_shared<STDOutput>();

	int bitArraySize = input->getSizeOfArray();

	std::vector<std::shared_ptr<IHashFunction>> hashFunctions;
	input->setHashFunctions(hashFunctions);

	std::shared_ptr<IDBSaver> dbSaver = std::make_shared<FileDBSaver>("data");

	BloomFilter bloomFilter(bitArraySize, hashFunctions, dbSaver);

	std::map<std::string, std::shared_ptr<ICommand>> commands;

	std::shared_ptr<AddURLCommand> addURLCommand = std::make_shared<AddURLCommand>(bloomFilter, input, dbSaver);
	commands["1"] = addURLCommand;

	std::shared_ptr<CheckURLCommand> checkURLCommand = std::make_shared<CheckURLCommand>(bloomFilter, input, output);
	commands["2"] = checkURLCommand;

	App app(commands, input);
	app.run();

	return 0;
}