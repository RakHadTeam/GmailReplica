#include <string>
#include <IO/Input/InitInput/IInitInput.h>
#include <iostream>
#include <sstream>
#include <BloomFilter/HashFunction/STDHash/STDHash.h>

class STDInitInput : public IInitInput {
private:
	std::string firstLine;

	// Check if a given string represents a positive integer
	bool isPositiveInteger(const std::string& str);

	// Validate if the input stream containsInArray only positive integers
	bool isValidInputStream();

public:
	void setHashFunctions(std::vector<std::shared_ptr<IHashFunction>>& hashFunctions) override;
	int getSizeOfArray() override;
};