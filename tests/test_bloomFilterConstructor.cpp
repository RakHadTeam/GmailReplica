#include <gtest/gtest.h>
#include <vector>
#include "../src/BloomFilter/BloomFilter.cpp"
#include "../src/BloomFilter/HashFunction/STDHash.cpp"

class SimpleHashFunction : public IHashFunction
{
public:
	SimpleHashFunction(size_t mod) : mod_(mod) {}

	size_t hash(const std::string& key) const override
	{
		std::hash<std::string> hasher;
		size_t hashValue = hasher(key);
		return hashValue % mod_; // Simple modulo hash function
	}

private:
	size_t mod_;
};


TEST(BloomFilterConstructorTest, ParameterizedConstructor)
{
	size_t filterSize = 1000;
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions;
	hashFunctions.push_back(std::make_shared<SimpleHashFunction>(1000));
	hashFunctions.push_back(std::make_shared<SimpleHashFunction>(500));
	hashFunctions.push_back(std::make_shared<SimpleHashFunction>(333));
	BloomFilter bf(filterSize, hashFunctions);

	EXPECT_EQ(bf.getBitArraySize(), filterSize);
	EXPECT_EQ(bf.hashFunctionCount(), hashFunctions.size());
}

TEST(BloomFilterConstructorTest, CopyConstructor)
{
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions;
	hashFunctions.push_back(std::make_shared<SimpleHashFunction>(1000));
	BloomFilter original(1000, hashFunctions);
	BloomFilter copy(original);

	EXPECT_EQ(copy.getBitArraySize(), original.getBitArraySize());
	EXPECT_EQ(copy.hashFunctionCount(), original.hashFunctionCount());
}

TEST(BloomFilterConstructorTest, MoveConstructor)
{
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions;
	hashFunctions.push_back(std::make_shared<SimpleHashFunction>(1000));
	BloomFilter original(1000, hashFunctions);
	BloomFilter moved(std::move(original));

	EXPECT_EQ(moved.getBitArraySize(), 1000);
	EXPECT_EQ(moved.setHashFunctions(), hashFunctions);
	// Assuming original is in a valid but unspecified state after move
}