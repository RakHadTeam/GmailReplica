#include <gtest/gtest.h>
#include <vector>
#include "../src/BloomFilter.h" // Include your Bloom Filter header file

class SimpleHashFunction : public IHashFunction {
public:
    explicit SimpleHashFunction(size_t mod) : mod_(mod) {}
    
    size_t hash(const std::string& key) const override {
        std::hash<std::string> hasher;
        size_t hashValue = hasher(key);
        return hashValue % mod_; // Simple modulo hash function
    }

private:
    size_t mod_;
};

TEST(BloomFilterConstructorTest, DefaultConstructor) {
    BloomFilter bf;
    EXPECT_EQ(bf.getBitArraySize(), 0); // Assuming getBitArraySize() returns the size of the filter
    EXPECT_EQ(bf.hashFunctionCount(), 0); // Assuming getHashFunctions() returns the vector of hash functions
}

TEST(BloomFilterConstructorTest, ParameterizedConstructor) {
    size_t filterSize = 1000;
    SimpleHashFunction hashFunc1(1000);
    SimpleHashFunction hashFunc2(500);
    SimpleHashFunction hashFunc3(333);

    std::vector<IHashFunction*> hashFunctions = {
        &hashFunc1,
        &hashFunc2,
        &hashFunc3
    };
    BloomFilter bf(filterSize, hashFunctions);
    
    EXPECT_EQ(bf.getBitArraySize(), filterSize);
    EXPECT_EQ(bf.hashFunctionCount(), hashFunctions.size());
}


TEST(BloomFilterConstructorTest, CopyConstructor) {
    std::vector<IHashFunction*> hashFunctions = {
        new SimpleHashFunction(1000)
    };
    BloomFilter original(1000, hashFunctions);
    BloomFilter copy(original);

    EXPECT_EQ(copy.getBitArraySize(), original.getBitArraySize());
    EXPECT_EQ(copy.hashFunctionCount(), original.hashFunctionCount());

    // Clean up allocated memory
    for (auto* func : hashFunctions) {
        delete func;
    }
}

TEST(BloomFilterConstructorTest, MoveConstructor) {
    std::vector<IHashFunction*> hashFunctions = {
        new SimpleHashFunction(1000)
    };
    BloomFilter original(1000, hashFunctions);
    BloomFilter moved(std::move(original));

    EXPECT_EQ(moved.getBitArraySize(), 1000);
    EXPECT_EQ(moved.getHashFunctions(), hashFunctions);
    // Assuming original is in a valid but unspecified state after move

    // Clean up allocated memory
    for (auto* func : hashFunctions) {
        delete func;
    }
}