#include <string>
#include "BloomFilter.h"
#include "AddCommand.h"
#include "STDINInput.h"
#include <map>
#include "App.cpp"
#include "Input.h"

int main()
{
	STDINInput input; // Create an instance of STDINInput

	// Remove the front element and store it in bitArraySize
	int bitArraySize = input.getSizeOfArray();

	std::vector<IHashFunction*> hashFunctions;
	input.getHashFunctions(hashFunctions);

	// Construct bloom filter:
	BloomFilter bloomFilter(bitArraySize, hashFunctions);

	std::map<std::string, ICommand*> commands;

	AddCommand* addCommand = new AddCommand(bloomFilter, &input);
	commands["1"] = addCommand;


	App app(commands);
	app.run();


	// Clean up dynamically allocated memory
	for (auto& command : commands)
	{
		delete command.second; // Delete each command object
	}

}