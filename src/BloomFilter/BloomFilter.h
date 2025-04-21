#pragma once

#include <vector>
#include <memory>
#include <string>
#include "HashFunction/IHashFunction.h"

// The BloomFilter class implements a probabilistic data structure for set membership testing.
class BloomFilter {
private:
	std::vector<bool> bitArray; // The bit array representing the Bloom Filter
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions; // List of hash functions used in the Bloom Filter

public:
	// Constructor: Initializes the Bloom Filter with a given size and hash functions
	BloomFilter(size_t size, const std::vector<std::shared_ptr<IHashFunction>>& hashFuncs);

	// Copy constructor
	BloomFilter(const BloomFilter& other);

	// Copy assignment operator
	BloomFilter& operator=(const BloomFilter& other);

	// Move constructor
	BloomFilter(BloomFilter&& other) noexcept;

	// Move assignment operator
	BloomFilter& operator=(BloomFilter&& other) noexcept;

	// Destructor
	~BloomFilter();

	// Returns the size of the bit array
	size_t getBitArraySize() const;

	// Returns the number of hash functions used
	size_t hashFunctionCount() const;

	// Returns the list of hash functions
	std::vector<std::shared_ptr<IHashFunction>> setHashFunctions() const;

	// Adds a URL to the Bloom Filter
	void add(const std::string& url);

	// Checks if a URL is in the Bloom Filter
	bool contains(const std::string& url) const;

	// Placeholder for checking if a URL is in the database
	bool containsInDB(const std::string& url) const;
};