#include <vector>
#include <iostream>
#include "IHashFunction.h"

class BloomFilter {
    private:
        std::vector<bool> bitArray;
        std::vector<IHashFunction*> hashFunctions;
    
    public:
        BloomFilter(size_t size, const std::vector<IHashFunction*>& hashFuncs)
            : bitArray(size, false), hashFunctions(hashFuncs) {}

        // Copy constructor
        BloomFilter(const BloomFilter& other)
            : bitArray(other.bitArray), hashFunctions(other.hashFunctions) {}

        // copy assignment operator
        BloomFilter& operator=(const BloomFilter& other) {
            if (this != &other) {
                bitArray = other.bitArray;
                hashFunctions = other.hashFunctions;
            }
            return *this;
        }

        // Move constructor
        BloomFilter(BloomFilter&& other) noexcept
            : bitArray(std::move(other.bitArray)), hashFunctions(std::move(other.hashFunctions)) {}
        
        // move assignment operator
        BloomFilter& operator=(BloomFilter&& other) noexcept {
            if (this != &other) {
                bitArray = std::move(other.bitArray);
                hashFunctions = std::move(other.hashFunctions);
            }
            return *this;
        }

        // Destructor
        ~BloomFilter() {
            for (auto* func : hashFunctions) {
            delete func; // Assuming ownership of hash functions
            }
        }

        BloomFilter() : bitArray(0), hashFunctions() {}
        

        size_t getBitArraySize() const {
            return bitArray.size();
        }

        size_t hashFunctionCount() const {
            return hashFunctions.size();
        }

        std::vector<IHashFunction*> getHashFunctions() const {
            return hashFunctions;
        }
    };
