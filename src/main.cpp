#include <string>
#include <BloomFilter/BloomFilter.h>
#include <Commands/AddURLCommand/AddURLCommand.h>
#include <IO/Input/STDInput/STDInput.h>
#include <map>
#include <memory>
#include <filesystem>
#include <App/App.h>
#include <IO/Input/IInput.h>
#include <Commands/CheckURLCommand/CheckURLCommand.h>
#include <IO/Output/STDOutput/STDOutput.h>
#include <DB/FileDB/FileDBSaver/FileDBSaver.h>
#include <DB/FileDB/FileDBLoader/FileDBLoader.h>

#define DATA_FOLDER   "data"
#define BLACKLIST_FILENAME  "blacklist"
#define FILTER_FILENAME     "array_filter"

int main() {
	auto input = std::make_shared<STDInput>();
	auto output = std::make_shared<STDOutput>();

	int bitArraySize = input->getSizeOfArray();

	std::vector<std::shared_ptr<IHashFunction>> hashFunctions;
	input->setHashFunctions(hashFunctions);

	std::shared_ptr<IDBSaver> dbSaver = std::make_shared<FileDBSaver>(DATA_FOLDER, BLACKLIST_FILENAME, FILTER_FILENAME);
	std::shared_ptr<IDBLoader> dbLoader = std::make_shared<FileDBLoader>(DATA_FOLDER, BLACKLIST_FILENAME, FILTER_FILENAME);

	BloomFilter bloomFilter(bitArraySize, hashFunctions, dbSaver, dbLoader);

	std::map<std::string, std::shared_ptr<ICommand>> commands;

	

	auto addURLCommand = std::make_shared<AddURLCommand>(bloomFilter, input, dbSaver);
	commands["POST"] = addURLCommand;

	auto checkURLCommand = std::make_shared<CheckURLCommand>(bloomFilter, input, output);
	commands["GET"] = checkURLCommand;

	App app(commands, input);
	app.run();

	return 0;
}
