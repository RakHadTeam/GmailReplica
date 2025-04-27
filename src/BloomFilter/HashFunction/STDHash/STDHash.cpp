#include <BloomFilter/HashFunction/STDHash/STDHash.h>

// Constructor implementation
STDHash::STDHash(int num) : numOfTimes(num) {}

// Override the hash function to apply the standard library's hash function multiple times
size_t STDHash::hash(const std::string& key) const {
	std::hash<std::string> hasher; // Standard library hash function for strings
	size_t hashValue = hasher(key); // Initial hash value for the input key

	// Apply the hash function repeatedly based on numOfTimes
	for (int i = 1; i < numOfTimes; ++i) {
		hasher = std::hash<std::string>(); // Reinitialize the hasher
		hashValue = hasher(std::to_string(hashValue)); // Hash the string representation of the current hash value
	}

	return hashValue; // Return the final hash value
}