#include <string>
#include "BloomFilter.h"
#include "AddURLCommand.h"
#include "STDINInput.h"
#include <map>
#include "App.cpp"
#include "IInput.h"
#include "CheckURLCommand.h"

int main()
{
	STDINInput input; // Create an instance of STDINInput

	// Remove the front element and store it in bitArraySize
	int bitArraySize = input.getSizeOfArray();

	std::vector<IHashFunction*> hashFunctions;
	input.getHashFunctions(hashFunctions);

	// Construct bloom filter:
	BloomFilter bloomFilter(bitArraySize, hashFunctions);
	
	//Real blackList
	std::unordered_set<std::string> realBlacklist;

	std::map<std::string, ICommand*> commands;

	AddURLCommand* addURLCommand = new AddURLCommand(bloomFilter, &input);
	commands["1"] = addURLCommand;
    
	 // Command 2 – Check URL
	 CheckURLCommand* checkURLCommand = new CheckURLCommand(bloomFilter, &input, realBlacklist);
	 commands["2"] = checkURLCommand;
 

	App app(commands);
	app.run();


	// Clean up dynamically allocated memory
	for (auto& command : commands)
	{
		delete command.second; // Delete each command object
	}

}