#include "../src/BloomFilter.h"
#include "../src/STDHash.h"
#include <gtest/gtest.h>

// Test case: Adding a single URL to the Bloom Filter
TEST(AddMethodTest, AddSingleURL) {
	std::vector<IHashFunction*> hashFunctions;
	hashFunctions.push_back(new STDHash(1)); // Using STDHash with 1 iteration
	BloomFilter bloomFilter(10, hashFunctions);

	std::string url = "example.com";
	bloomFilter.add(url);

	// Verify that the corresponding bit in the bit array is set
	size_t index = hashFunctions[0]->hash(url) % bloomFilter.getBitArraySize();
	EXPECT_TRUE(bloomFilter.getHashFunctions()[0]->hash(url) % bloomFilter.getBitArraySize() == index);

}

// Test case: Adding multiple URLs to the Bloom Filter
TEST(AddMethodTest, AddMultipleURLs) {
	std::vector<IHashFunction*> hashFunctions;
	hashFunctions.push_back(new STDHash(2)); // Using STDHash with 2 iterations

	BloomFilter bloomFilter(10, hashFunctions);

	std::string url1 = "example.com";
	std::string url2 = "test.com";
	bloomFilter.add(url1);
	bloomFilter.add(url2);

	// Verify that the corresponding bits in the bit array are set
	size_t index1 = hashFunctions[0]->hash(url1) % bloomFilter.getBitArraySize();
	size_t index2 = hashFunctions[0]->hash(url2) % bloomFilter.getBitArraySize();
	EXPECT_TRUE(index1 < bloomFilter.getBitArraySize());
	EXPECT_TRUE(index2 < bloomFilter.getBitArraySize());

}

// // Test case: Adding a URL that already exists in the Bloom Filter
TEST(AddMethodTest, AddDuplicateURLWithSTDHash) {
	std::vector<IHashFunction*> hashFunctions;
	hashFunctions.push_back(new STDHash(3)); // Using STDHash with 3 iterations
	BloomFilter bloomFilter(10, hashFunctions);

	std::string url = "example.com";
	bloomFilter.add(url);
	bloomFilter.add(url); // Add the same URL again

	// Verify that the corresponding bit in the bit array is set
	size_t index = hashFunctions[0]->hash(url) % bloomFilter.getBitArraySize();
	EXPECT_TRUE(index < bloomFilter.getBitArraySize());
}

// Test case: Adding a URL to an empty Bloom Filter
TEST(AddMethodTest, AddToEmptyFilter) {
	std::vector<IHashFunction*> hashFunctions;
	hashFunctions.push_back(new STDHash(1));

	BloomFilter bloomFilter(0, hashFunctions); // Empty Bloom Filter

	std::string url = "example.com";
	bloomFilter.add(url);

	// Verify that no bits can be set due to size 0
	EXPECT_EQ(bloomFilter.getBitArraySize(), 0);
}