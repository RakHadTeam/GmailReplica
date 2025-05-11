#include <BloomFilter/BloomFilter.h>
#include <BloomFilter/HashFunction/STDHash/STDHash.h>
#include <gtest/gtest.h>

TEST(AddMethodTest, AddSingleURL) {
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions;
	hashFunctions.push_back(std::make_shared<STDHash>(1));
	BloomFilter bloomFilter(10, hashFunctions);

	std::string url = "example.com";
	bloomFilter.add(url);

	// Verify that the corresponding bit in the bit array is set
	size_t index = hashFunctions[0]->hash(url) % bloomFilter.getBitArraySize();
	EXPECT_TRUE(bloomFilter.setHashFunctions()[0]->hash(url) % bloomFilter.getBitArraySize() == index);

}

TEST(AddMethodTest, AddMultipleURLs) {
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions;
	hashFunctions.push_back(std::make_shared<STDHash>(2));

	BloomFilter bloomFilter(10, hashFunctions);

	std::string url1 = "example.com";
	std::string url2 = "test.com";
	bloomFilter.add(url1);
	bloomFilter.add(url2);

	size_t index1 = hashFunctions[0]->hash(url1) % bloomFilter.getBitArraySize();
	size_t index2 = hashFunctions[0]->hash(url2) % bloomFilter.getBitArraySize();
	EXPECT_TRUE(index1 < bloomFilter.getBitArraySize());
	EXPECT_TRUE(index2 < bloomFilter.getBitArraySize());

}

TEST(AddMethodTest, AddDuplicateURLWithSTDHash) {
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions;
	hashFunctions.push_back(std::make_shared<STDHash>(3));
	BloomFilter bloomFilter(10, hashFunctions);

	std::string url = "example.com";
	bloomFilter.add(url);
	bloomFilter.add(url); // Add the same URL again

	// Verify that the corresponding bit in the bit array is set
	size_t index = hashFunctions[0]->hash(url) % bloomFilter.getBitArraySize();
	EXPECT_TRUE(index < bloomFilter.getBitArraySize());
}

TEST(AddMethodTest, AddToEmptyFilter) {
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions;
	hashFunctions.push_back(std::make_shared<STDHash>(1));

	BloomFilter bloomFilter(0, hashFunctions); // Empty Bloom Filter

	std::string url = "example.com";
	bloomFilter.add(url);

	// Verify that no bits can be set due to size 0
	EXPECT_EQ(bloomFilter.getBitArraySize(), 0);
}