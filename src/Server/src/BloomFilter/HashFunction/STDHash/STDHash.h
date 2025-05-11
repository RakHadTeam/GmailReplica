#pragma once

#include <BloomFilter/HashFunction/IHashFunction.h>
#include <string>
#include <functional>

// The STDHash class implements a hash function that applies the standard library's hash function
// multiple times to a given key.

class STDHash : public IHashFunction {
private:
	int numOfTimes; // Number of times the hash function should be applied
public:
	explicit STDHash(int num); // Constructor

	// Override the hash function to apply the standard library's hash function multiple times
	size_t hash(const std::string& key) const override;
};