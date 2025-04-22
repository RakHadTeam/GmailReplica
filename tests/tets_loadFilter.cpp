#include <gtest/gtest.h>
#include <fstream>
#include <vector>
#include <string>
#include <memory>
#include <filesystem>
#include <iostream>
#include <../src/BloomFilter/BloomFilter.h>
#include <../src/BloomFilter/HashFunction/STDHash.h>
#include "../src/DB/FileDB/FileDBLoader.h"

// Test case: File does not exist, bit array should remain unchanged
TEST(LoadFilterArrayTest, MissingFileDoesNotChangeArray) {
	std::filesystem::remove("data/filter_array.txt"); // Remove if exists

	std::shared_ptr<STDHash> hashFunc = std::make_shared<STDHash>(1);
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions = { hashFunc };
	std::shared_ptr<IDBLoader> dbLoader = std::make_shared<FileDBLoader>("data");

	BloomFilter bloom(8, hashFunctions, nullptr, dbLoader);
	std::vector<bool> original = bloom.getBitArray();

	EXPECT_FALSE(bloom.loadFromFile("data/filter_array.txt"));
	EXPECT_EQ(bloom.getBitArray(), original);
}

// Test case: Empty file, bit array should remain unchanged
TEST(LoadFilterArrayTest, EmptyFileDoesNotChangeArray) {
	std::ofstream outFile("data/filter_array.txt");
	outFile.close(); // Create empty file

	std::shared_ptr<STDHash> hashFunc = std::make_shared<STDHash>(1);
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions = { hashFunc };
	std::shared_ptr<IDBLoader> dbLoader = std::make_shared<FileDBLoader>("data");

	BloomFilter bloom(8, hashFunctions, nullptr, dbLoader);
	std::vector<bool> original = bloom.getBitArray();

	bloom.loadFromFile("data/filter_array.txt");

	std::vector<bool> after = bloom.getBitArray();
	EXPECT_EQ(after, original);
}

// Test case: File contains invalid characters, bit array should remain unchanged
TEST(LoadFilterArrayTest, InvalidCharacterInFileDoesNotChangeArray) {
	std::ofstream outFile("data/filter_array.txt");
	outFile << "10102010"; // Invalid bit '2'
	outFile.close();

	std::shared_ptr<STDHash> hashFunc = std::make_shared<STDHash>(1);
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions = { hashFunc };
	std::shared_ptr<IDBLoader> dbLoader = std::make_shared<FileDBLoader>("data");

	BloomFilter bloom(8, hashFunctions, nullptr, dbLoader);

	EXPECT_FALSE(bloom.loadFromFile("data/filter_array.txt"));
	EXPECT_EQ(bloom.getBitArray(), std::vector<bool>(8, false));
}

// Test case: File is too short, bit array should remain unchanged
TEST(LoadFilterArrayTest, TooShortFileDoesNotChangeArray) {
	std::ofstream outFile("data/filter_array.txt");
	outFile << "1010"; // Only 4 bits, expected 8
	outFile.close();

	std::shared_ptr<STDHash> hashFunc = std::make_shared<STDHash>(1);
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions = { hashFunc };
	std::shared_ptr<IDBLoader> dbLoader = std::make_shared<FileDBLoader>("data");

	BloomFilter bloom(8, hashFunctions, nullptr, dbLoader);

	EXPECT_FALSE(bloom.loadFromFile("data/filter_array.txt"));
	EXPECT_EQ(bloom.getBitArray(), std::vector<bool>(8, false));
}
