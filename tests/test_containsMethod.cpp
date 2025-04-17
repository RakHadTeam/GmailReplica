#include <gtest/gtest.h>
#include "../src/BloomFilter.h"
#include "../src/STDHash.h"

// Test: Add one URL and check it is detected
TEST(ContainsMethodTest, CheckSingleURL) {
	std::vector<IHashFunction*> hashFunctions;
	hashFunctions.push_back(new STDHash(1));

	BloomFilter bloomFilter(10, hashFunctions);
	std::string url = "example.com";
	bloomFilter.add(url);

	EXPECT_TRUE(bloomFilter.contains(url)); // Expect to find the URL we added
}

// Test: Add multiple URLs and check both are detected
TEST(ContainsMethodTest, CheckMultipleURLs) {
	std::vector<IHashFunction*> hashFunctions;
	hashFunctions.push_back(new STDHash(2));

	BloomFilter bloomFilter(10, hashFunctions);
	std::string url1 = "example.com";
	std::string url2 = "test.com";

	bloomFilter.add(url1);
	bloomFilter.add(url2);

	EXPECT_TRUE(bloomFilter.contains(url1));
	EXPECT_TRUE(bloomFilter.contains(url2)); // Expect both URLs to be found
}

// Test: Check that a non-added URL returns false
TEST(ContainsMethodTest, CheckNonBlacklistedURL) {
	std::vector<IHashFunction*> hashFunctions;
	hashFunctions.push_back(new STDHash(1));

	BloomFilter bloomFilter(10, hashFunctions);
	std::string url = "example.com";

	EXPECT_FALSE(bloomFilter.contains(url)); // URL was never added → should return false
}

// Test: Check that multiple non-added URLs are not falsely detected
TEST(ContainsMethodTest, CheckMultipleNonBlacklistedURLs) {
	std::vector<IHashFunction*> hashFunctions;
	hashFunctions.push_back(new STDHash(2));

	BloomFilter bloomFilter(10, hashFunctions);
	std::string url1 = "example.com";
	std::string url2 = "test.com";

	EXPECT_FALSE(bloomFilter.contains(url1));
	EXPECT_FALSE(bloomFilter.contains(url2)); // Neither was added → should return false
}
