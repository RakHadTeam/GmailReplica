#pragma once

#include <vector>
#include <memory>
#include <string>
#include <algorithm>
#include <BloomFilter/HashFunction/IHashFunction.h>
#include <DB/IDBSaver.h>
#include <DB/IDBLoader.h>

// The BloomFilter class implements a probabilistic data structure for set membership testing.
class BloomFilter {
private:
	std::vector<bool> bitArray; // The bit array representing the Bloom Filter
	std::vector<std::string> URLarray;
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions; // List of hash functions used in the Bloom Filter
	std::shared_ptr<IDBSaver> dbSaver;
	std::shared_ptr<IDBLoader> dbLoader;



public:
	BloomFilter(size_t size, const std::vector<std::shared_ptr<IHashFunction>>& hashFuncs, std::shared_ptr<IDBSaver> dbSaver, std::shared_ptr<IDBLoader> dbLoader);

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

	// Returns the bit array
	std::vector<bool> getBitArray() const;

	// Returns the number of hash functions used
	size_t hashFunctionCount() const;

	// Returns the list of hash functions
	std::vector<std::shared_ptr<IHashFunction>> setHashFunctions() const;

	// Adds a URL to the Bloom Filter
	void add(const std::string& url);

	// Checks if a URL is in the Bloom Filter
	bool containsInArray(const std::string& url) const;

	// Placeholder for checking if a URL is in the database
	bool containsInDB(const std::string& url) const;

	void loadFromDB();

	void remove(const std::string& url);
};