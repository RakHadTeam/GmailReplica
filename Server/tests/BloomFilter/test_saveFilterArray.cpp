#include <gtest/gtest.h>
#include <fstream>
#include <vector>
#include <string>
#include <memory>
#include <filesystem>
#include <iostream>
#include <BloomFilter/BloomFilter.h>
#include <BloomFilter/HashFunction/STDHash/STDHash.h>
#include <DB/FileDB/FileDBSaver/FileDBSaver.h>

TEST(SaveFilterArrayTest, SaveFilterArray) {
	std::shared_ptr<STDHash> hashFunc = std::make_shared<STDHash>(1);
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions = {hashFunc};
	auto dbSaver = std::make_shared<FileDBSaver>("data", "blacklist", "array_filter");
	BloomFilter bloomFilter(8, hashFunctions, dbSaver, nullptr);

	bloomFilter.add("www.example.com");

	std::vector<bool> bitArray = bloomFilter.getBitArray();

	// Check for the file contents
	std::ifstream inFile("data/array_filter");
	std::string line;
	std::getline(inFile, line);

	for (size_t i = 0; i < bitArray.size(); ++i) {
		EXPECT_EQ(line[i], bitArray[i] ? '1' : '0');
	}

	inFile.close();
}

// For multiple adds

TEST(SaveFilterArrayTest, SaveMultipleFilterArray) {
	std::shared_ptr<STDHash> hashFunc = std::make_shared<STDHash>(1);
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions = {hashFunc};
	auto dbSaver = std::make_shared<FileDBSaver>("data", "blacklist", "array_filter");
	BloomFilter bloomFilter(8, hashFunctions, dbSaver, nullptr);

	bloomFilter.add("www.example.com");
	bloomFilter.add("www.test.com");

	std::vector<bool> bitArray = bloomFilter.getBitArray();

	// Check for the file contents
	std::ifstream inFile("data/array_filter");
	std::string line;
	std::getline(inFile, line);

	for (size_t i = 0; i < bitArray.size(); ++i) {
		EXPECT_EQ(line[i], bitArray[i] ? '1' : '0');
	}

	inFile.close();
}

// For non exist file
// Delete the file before running the test
TEST(SaveFilterArrayTest, NonExistFile) {
	std::filesystem::remove("data/array_filter");

	std::shared_ptr<STDHash> hashFunc = std::make_shared<STDHash>(1);
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions = {hashFunc};
	auto dbSaver = std::make_shared<FileDBSaver>("data", "blacklist", "array_filter");
	BloomFilter bloomFilter(8, hashFunctions, dbSaver, nullptr);

	bloomFilter.add("www.example.com");

	std::vector<bool> bitArray = bloomFilter.getBitArray();

	// Check for the file contents
	std::ifstream inFile("data/array_filter");
	std::string line;
	std::getline(inFile, line);

	std::cout << "bitArray.size(): " << bitArray.size() << std::endl;

	for (size_t i = 0; i < bitArray.size(); ++i) {
		EXPECT_EQ(line[i], bitArray[i] ? '1' : '0');
	}

	inFile.close();
}

// For empty file
TEST(SaveFilterArrayTest, EmptyFile) {
	std::filesystem::remove("data/array_filter");
	std::ofstream outFile("data/array_filter");
	outFile.close();

	std::shared_ptr<STDHash> hashFunc = std::make_shared<STDHash>(1);
	std::vector<std::shared_ptr<IHashFunction>> hashFunctions = {hashFunc};
	auto dbSaver = std::make_shared<FileDBSaver>("data", "blacklist", "array_filter");
	BloomFilter bloomFilter(8, hashFunctions, dbSaver, nullptr);

	bloomFilter.add("www.example.com");

	std::vector<bool> bitArray = bloomFilter.getBitArray();

	// Check for the file contents
	std::ifstream inFile("data/array_filter");
	std::string line;
	std::getline(inFile, line);

	for (size_t i = 0; i < bitArray.size(); ++i) {
		EXPECT_EQ(line[i], bitArray[i] ? '1' : '0');
	}

	inFile.close();
}