#include <vector>
#include <iostream>
#include "IHashFunction.h"

// BloomFilter class: Implements a simple Bloom Filter data structure
class BloomFilter
{
private:
	std::vector<bool> bitArray;                 // The bit array representing the Bloom Filter
	std::vector<IHashFunction*> hashFunctions; // List of hash functions used in the Bloom Filter


public:
	// Constructor: Initializes the Bloom Filter with a given size and hash functions
	BloomFilter(size_t size, const std::vector<IHashFunction*>& hashFuncs)
		: bitArray(size, false), hashFunctions(hashFuncs)
	{
	}

	// Copy constructor: Creates a deep copy of another BloomFilter object
	BloomFilter(const BloomFilter& other)
		: bitArray(other.bitArray)
	{
		// Deep copy of hash functions
		for (auto* func : other.hashFunctions)
		{
			hashFunctions.push_back(func->clone());
		}
	}

	// Copy assignment operator: Assigns the state of another BloomFilter object
	BloomFilter& operator=(const BloomFilter& other)
	{
		if (this != &other)
		{ // Avoid self-assignment
			bitArray = other.bitArray;
			hashFunctions = other.hashFunctions;
		}
		return *this;
	}

	// Move constructor: Transfers ownership of resources from another BloomFilter object
	BloomFilter(BloomFilter&& other) noexcept
		: bitArray(std::move(other.bitArray)), hashFunctions(std::move(other.hashFunctions)) {
	}

	// Move assignment operator: Transfers ownership of resources from another BloomFilter object
	BloomFilter& operator=(BloomFilter&& other) noexcept
	{
		if (this != &other)
		{ // Avoid self-assignment
			bitArray = std::move(other.bitArray);
			hashFunctions = std::move(other.hashFunctions);
		}
		return *this;
	}

	// Destructor: Cleans up dynamically allocated hash functions
	~BloomFilter()
	{
		for (auto* func : hashFunctions)
		{
			delete func; // Assuming ownership of hash functions
		}
	}

	// Default constructor: Creates an empty Bloom Filter
	BloomFilter() : bitArray(0), hashFunctions() {}

	// Returns the size of the bit array
	size_t getBitArraySize() const
	{
		return bitArray.size();
	}

	// Returns the number of hash functions used
	size_t hashFunctionCount() const
	{
		return hashFunctions.size();
	}

	// Returns the list of hash functions
	std::vector<IHashFunction*> getHashFunctions() const
	{
		return hashFunctions;
	}

	// Adds URL to the Bloom Filter
	void add(const std::string& url)
	{
		if (contains(url))
		{
			return; // URL already exists in the Bloom Filter
		}

		if (bitArray.size() == 0)
		{
			return;
		}

		for (const auto& hashFunc : hashFunctions)
		{
			size_t index = hashFunc->hash(url) % bitArray.size(); // Calculate the index in the bit array
			bitArray[index] = true;                               // Set the corresponding bit to true
		}
	}

	// Contains URL:

	bool contains(const std::string& url) const
	{
		if (bitArray.empty()) return false;

		//Check if one of the bit in bitArray is 0
	   for (const auto& hashFunc : hashFunctions)
	   {
		   size_t index = hashFunc->hash(url) % bitArray.size();
		   if (!bitArray[index])
			   return false;
	   }
	   
	   //All the bits is 1
	   return true;
	}

	bool containsInFile(const std::string& url) const
	{
		// TODO: Implement the containsInFile method
		return false;
	}
};
