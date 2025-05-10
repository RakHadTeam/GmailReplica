#pragma once
#include <string>
#include <memory>
#include <vector>
#include <BloomFilter/HashFunction/IHashFunction.h>

class IInitInput {
public:
	// Read and validate a list of positive integers from the user
	virtual void setHashFunctions(std::vector<std::shared_ptr<IHashFunction>>& hashFunctions) = 0;

	// Get the size of the array from user input
	virtual int getSizeOfArray() = 0;

	virtual ~IInitInput() = default;
};