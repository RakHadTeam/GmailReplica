#include "IHashFunction.h"

// The STDHash class implements a hash function that applies the standard library's hash function
// multiple times to a given key. This can be useful for scenarios where additional hashing is needed
// to reduce collisions or for specific hashing strategies.
class STDHash : public IHashFunction {
    private:
        int numOfTimes; // Number of times the hash function should be applied
    public:
        // Constructor to initialize the number of times the hash function should be applied
        explicit STDHash(int num) : numOfTimes(num) {}

        // Override the hash function to apply the standard library's hash function multiple times
        size_t hash(const std::string& key) const override {
            std::hash<std::string> hasher; // Standard library hash function for strings
            size_t hashValue = hasher(key); // Initial hash value for the input key

            // Apply the hash function repeatedly based on numOfTimes
            for (int i = 1; i < numOfTimes; ++i) {
                hasher = std::hash<std::string>(); // Reinitialize the hasher
                hashValue = hasher(std::to_string(hashValue)); // Hash the string representation of the current hash value
            }

            return hashValue; // Return the final hash value
        }
};