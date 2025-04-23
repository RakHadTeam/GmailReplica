#include <gtest/gtest.h>
#include "../src/BloomFilter/BloomFilter.h"
#include "../src/BloomFilter/HashFunction/STDHash.h"

TEST(ContainsMethodTest, CheckSingleURL) {
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions;
	hashFunctions.push_back(std::make_shared<STDHash>(1));

	BloomFilter bloomFilter(10, hashFunctions);
	std::string url = "example.com";
	bloomFilter.add(url);

	EXPECT_TRUE(bloomFilter.containsInArray(url)); // URL was added → should return true
}

TEST(ContainsMethodTest, CheckMultipleURLs) {
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions;
	hashFunctions.push_back(std::make_shared<STDHash>(2));

	BloomFilter bloomFilter(10, hashFunctions);
	std::string url1 = "example.com";
	std::string url2 = "test.com";

	bloomFilter.add(url1);
	bloomFilter.add(url2);

	EXPECT_TRUE(bloomFilter.containsInArray(url1));
	EXPECT_TRUE(bloomFilter.containsInArray(url2)); // Both should return true
}

TEST(ContainsMethodTest, CheckNonBlacklistedURL) {
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions;
	hashFunctions.push_back(std::make_shared<STDHash>(1));

	BloomFilter bloomFilter(10, hashFunctions);
	std::string url = "example.com";

	EXPECT_FALSE(bloomFilter.containsInArray(url)); // URL was not added → should return false
}

TEST(ContainsMethodTest, CheckMultipleNonBlacklistedURLs) {
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions;
	hashFunctions.push_back(std::make_shared<STDHash>(2));

	BloomFilter bloomFilter(10, hashFunctions);
	std::string url1 = "example.com";
	std::string url2 = "test.com";

	EXPECT_FALSE(bloomFilter.containsInArray(url1));
	EXPECT_FALSE(bloomFilter.containsInArray(url2)); // Neither was added → should return false
}
