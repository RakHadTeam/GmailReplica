#include <vector>
#include <memory>
#include <iostream>
#include "HashFunction/IHashFunction.h"
#include "BloomFilter.h"

// Constructor: Initializes the Bloom Filter with a given size and hash functions
BloomFilter::BloomFilter(size_t size, const std::vector<std::shared_ptr<IHashFunction>>& hashFuncs)
	: bitArray(size, false) {
	for (const auto& hashFunc : hashFuncs) {
		hashFunctions.push_back(hashFunc);
	}
}

// Copy constructor
BloomFilter::BloomFilter(const BloomFilter& other)
	: bitArray(other.bitArray) {
	for (const auto& hashFunc : other.hashFunctions) {
		hashFunctions.push_back(hashFunc);
	}
}

// Copy assignment operator
BloomFilter& BloomFilter::operator=(const BloomFilter& other) {
	if (this != &other) { // Avoid self-assignment
		bitArray = other.bitArray; // Copy the bit array

		hashFunctions.clear(); // Clear existing hash functions
		for (const auto& hashFunc : other.hashFunctions) {
			hashFunctions.push_back(hashFunc);
		}
	}
	return *this;
}

// Move constructor
BloomFilter::BloomFilter(BloomFilter&& other) noexcept
	: bitArray(std::move(other.bitArray)), hashFunctions(std::move(other.hashFunctions)) {
}

// Move assignment operator
BloomFilter& BloomFilter::operator=(BloomFilter&& other) noexcept {
	if (this != &other) { // Avoid self-assignment
		bitArray = std::move(other.bitArray);
		hashFunctions = std::move(other.hashFunctions);
	}
	return *this;
}

// Destructor
BloomFilter::~BloomFilter() {
	hashFunctions.clear(); // Clear the vector of hash functions
}

// Returns the size of the bit array
size_t BloomFilter::getBitArraySize() const {
	return bitArray.size();
}

// Returns the number of hash functions used
size_t BloomFilter::hashFunctionCount() const {
	return hashFunctions.size();
}

// Returns the list of hash functions
std::vector<std::shared_ptr<IHashFunction>> BloomFilter::setHashFunctions() const {
	return hashFunctions;
}

// Adds a URL to the Bloom Filter
void BloomFilter::add(const std::string& url) {
	if (contains(url)) {
		return; // URL already exists in the Bloom Filter
	}

	if (bitArray.size() == 0) {
		return;
	}

	for (const auto& hashFunc : hashFunctions) {
		size_t index = hashFunc->hash(url) % bitArray.size(); // Calculate the index in the bit array
		bitArray[index] = true;                               // Set the corresponding bit to true
	}
}

// Checks if a URL is in the Bloom Filter
bool BloomFilter::contains(const std::string& url) const {
	if (bitArray.empty()) return false;

	// Check if one of the bits in bitArray is 0
	for (const auto& hashFunc : hashFunctions) {
		size_t index = hashFunc->hash(url) % bitArray.size();
		if (!bitArray[index])
			return false;
	}

	// All the bits are 1
	return true;
}

// Placeholder for checking if a URL is in the database
bool BloomFilter::containsInDB(const std::string& url) const {
	// TODO: Implement the containsInDB method
	return false;
}