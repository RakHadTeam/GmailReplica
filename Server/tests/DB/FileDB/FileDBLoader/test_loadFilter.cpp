#include <gtest/gtest.h>
#include <fstream>
#include <vector>
#include <string>
#include <memory>
#include <filesystem>
#include <BloomFilter/BloomFilter.h>
#include <BloomFilter/HashFunction/STDHash/STDHash.h>
#include <DB/FileDB/FileDBLoader/FileDBLoader.h>

TEST(LoadFilterArrayTest, MissingFileDoesNotChangeArray) {
	std::filesystem::remove("data/array_filter");

	auto hashFunc = std::make_shared<STDHash>(1);
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions = { hashFunc };
	auto dbLoader = std::make_shared<FileDBLoader>("data", "blacklist", "array_filter");

	BloomFilter bloom(8, hashFunctions, nullptr, dbLoader);
	std::vector<bool> original = bloom.getBitArray();

	EXPECT_EQ(bloom.getBitArray(), original);
}

TEST(LoadFilterArrayTest, EmptyFileDoesNotChangeArray) {
	std::ofstream("data/array_filter").close();

	auto hashFunc = std::make_shared<STDHash>(1);
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions = { hashFunc };
	auto dbLoader = std::make_shared<FileDBLoader>("data", "blacklist", "array_filter");

	BloomFilter bloom(8, hashFunctions, nullptr, dbLoader);
	std::vector<bool> original = bloom.getBitArray();

	bloom.loadFromDB();
	EXPECT_EQ(bloom.getBitArray(), original);
}

TEST(LoadFilterArrayTest, InvalidCharacterInFileDoesNotChangeArray) {
	std::ofstream("data/array_filter") << "10102010";

	auto hashFunc = std::make_shared<STDHash>(1);
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions = { hashFunc };
	auto dbLoader = std::make_shared<FileDBLoader>("data", "blacklist", "array_filter");

	BloomFilter bloom(8, hashFunctions, nullptr, dbLoader);

	EXPECT_EQ(bloom.getBitArray(), std::vector<bool>(8, false));
}

TEST(LoadFilterArrayTest, TooShortFileDoesNotChangeArray) {
	std::ofstream("data/array_filter") << "1010";

	auto hashFunc = std::make_shared<STDHash>(1);
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions = { hashFunc };
	auto dbLoader = std::make_shared<FileDBLoader>("data", "blacklist", "array_filter");

	BloomFilter bloom(8, hashFunctions, nullptr, dbLoader);

	EXPECT_EQ(bloom.getBitArray(), std::vector<bool>(8, false));
}
