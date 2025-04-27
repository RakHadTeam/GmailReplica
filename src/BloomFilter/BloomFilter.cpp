#include <vector>
#include <memory>
#include <iostream>
#include <BloomFilter/HashFunction/IHashFunction.h>
#include <BloomFilter/BloomFilter.h>

// Constructor: Initializes the Bloom Filter with a given size and hash functions
BloomFilter::BloomFilter(size_t size, const std::vector<std::shared_ptr<IHashFunction>>& hashFuncs, std::shared_ptr<IDBSaver> dbSaver, std::shared_ptr<IDBLoader> dbLoader)
	: dbSaver(dbSaver), dbLoader(dbLoader), // Initialize the database saver
	bitArray(size, false) {      // Initialize the bit array with the given size
	for (const auto& hashFunc : hashFuncs) {
		hashFunctions.push_back(hashFunc);
	}
	loadFromDB();
}

BloomFilter::BloomFilter(size_t size, const std::vector<std::shared_ptr<IHashFunction>>& hashFuncs)
	: bitArray(size, false) { // Initialize the bit array with the given size
	for (const auto& hashFunc : hashFuncs) {
		hashFunctions.push_back(hashFunc);
	}
	dbSaver = nullptr;
	dbLoader = nullptr;
	loadFromDB();
}

// Copy constructor
BloomFilter::BloomFilter(const BloomFilter& other)
	: bitArray(other.bitArray),              // Copy the bit array
	dbSaver(other.dbSaver),                // Copy the database saver
	dbLoader(other.dbLoader)               // Copy the database loader
{
	for (const auto& hashFunc : other.hashFunctions) {
		hashFunctions.push_back(hashFunc);
	}
	loadFromDB();
}


// Copy assignment operator
BloomFilter& BloomFilter::operator=(const BloomFilter& other) {
	if (this != &other) { // Avoid self-assignment
		bitArray = other.bitArray; // Copy the bit array
		dbSaver = other.dbSaver;   // Copy the database saver
		dbLoader = other.dbLoader;
		hashFunctions.clear(); // Clear existing hash functions
		for (const auto& hashFunc : other.hashFunctions) {
			hashFunctions.push_back(hashFunc);
		}
		loadFromDB();
	}
	return *this;
}

// Move constructor
BloomFilter::BloomFilter(BloomFilter&& other) noexcept
	: bitArray(std::move(other.bitArray)), hashFunctions(std::move(other.hashFunctions)), dbSaver(std::move(other.dbSaver)), dbLoader(std::move(other.dbLoader)) {
	loadFromDB();
}

// Move assignment operator
BloomFilter& BloomFilter::operator=(BloomFilter&& other) noexcept {
	if (this != &other) { // Avoid self-assignment
		bitArray = std::move(other.bitArray);
		hashFunctions = std::move(other.hashFunctions);
		dbSaver = std::move(other.dbSaver);
		dbLoader = std::move(other.dbLoader);
		loadFromDB();
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

std::vector<bool> BloomFilter::getBitArray() const {
	std::vector<bool> bitArrayCopy(bitArray);
	return bitArrayCopy;
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
	if (containsInDB(url)) {
		return; // URL already exists in the Bloom Filter
	}

	if (bitArray.size() == 0) {
		return;
	}

	for (const auto& hashFunc : hashFunctions) {
		size_t index = hashFunc->hash(url) % bitArray.size(); // Calculate the index in the bit array
		bitArray[index] = true;                               // Set the corresponding bit to true
	}

	if (dbSaver == nullptr) {
		return;
	}
	dbSaver->saveURL(url);
	dbSaver->saveFilterArray(bitArray);
	URLarray.push_back(url);
}

// Checks if a URL is in the Bloom Filter
bool BloomFilter::containsInArray(const std::string& url) const {
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

bool BloomFilter::containsInDB(const std::string& url) const {
	for (const auto& savedURL : URLarray) {
		if (savedURL == url) {
			return true;
		}
	}
	return false;
}


void BloomFilter::loadFromDB() {
	if (dbLoader == nullptr) {
		return;
	}
	dbLoader->loadURLs(URLarray);
	dbLoader->loadArrayFilter(bitArray);

}
