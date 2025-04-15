#include "../src/BloomFilter.h"
#include "../src/STDHash.h"
#include <gtest/gtest.h>

// Test fixture for BloomFilter
class BloomFilterTest : public ::testing::Test
{
protected:
    BloomFilter bloomFilter;

    void SetUp() override
    {
        // Initialize the BloomFilter with a reasonable size and hash functions
        std::vector<IHashFunction *> hashFunctions;
        hashFunctions.push_back(new STDHash(1));
        hashFunctions.push_back(new STDHash(2));
        hashFunctions.push_back(new STDHash(3));
        bloomFilter = BloomFilter(1000, hashFunctions);
    }
};

// Test case: Adding an element and checking if it exists
TEST_F(BloomFilterTest, ContainsAddedElement)
{
    std::string element = "testElement";
    bloomFilter.add(element);
    EXPECT_TRUE(bloomFilter.contains(element));
}

// Test case: Checking for an element that was not added
TEST_F(BloomFilterTest, DoesNotContainNonAddedElement)
{
    std::string element = "nonAddedElement";
    EXPECT_FALSE(bloomFilter.contains(element));
}

// Test case: Adding multiple elements and checking their existence
TEST_F(BloomFilterTest, ContainsMultipleAddedElements)
{
    std::vector<std::string> elements = {"element1", "element2", "element3"};
    for (const auto &element : elements)
    {
        bloomFilter.add(element);
    }
    for (const auto &element : elements)
    {
        EXPECT_TRUE(bloomFilter.contains(element));
    }
}

// Test case: False positive scenario
TEST_F(BloomFilterTest, FalsePositive)
{
    std::string element = "testElement";
    bloomFilter.add(element);

    // Check for a different element that might cause a false positive
    std::string falsePositiveElement = "falsePositiveElement";
    EXPECT_FALSE(bloomFilter.contains(falsePositiveElement));
}

// Test case: Edge case with an empty string
TEST_F(BloomFilterTest, EmptyString)
{
    std::string element = "";
    bloomFilter.add(element);
    EXPECT_TRUE(bloomFilter.contains(element));
}

// Test case: Edge case with a very large string
TEST_F(BloomFilterTest, LargeString)
{
    std::string element(10000, 'a'); // Large string of 10,000 'a' characters
    bloomFilter.add(element);
    EXPECT_TRUE(bloomFilter.contains(element));
}