#pragma once

#include <vector>
#include <memory>
#include <string>
#include <IO/Input/IInput.h>
#include <BloomFilter/HashFunction/STDHash/STDHash.h>
#include <Validators/URLValidator/URLValidator.h>

class STDInput : public IInput {
private:
	std::string firstLine;

	// Check if a given string represents a positive integer
	bool isPositiveInteger(const std::string& str);

	// Validate if the input stream containsInArray only positive integers
	bool isValidInputStream();

public:
	// Read and validate a list of positive integers from the user
	void setHashFunctions(std::vector<std::shared_ptr<IHashFunction>>& hashFunctions);

	// Get the size of the array from user input
	int getSizeOfArray();

	// Get a URL from user input
	std::string getURL();

	// Get a command prefix from user input
	std::string getCommandPrefix();
};