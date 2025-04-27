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

// Initialize the BloomFilter with the FileDBSaver
std::shared_ptr<STDHash> hashFunc = std::make_shared<STDHash>(1);

// Print current working directory
std::string currentPath = std::filesystem::current_path().string();	

std::shared_ptr<IDBSaver> dbSaver = std::make_shared<FileDBSaver>("data","blacklist","array_filter");
std::vector<std::shared_ptr<IHashFunction>> hashFunctions = {hashFunc};

BloomFilter bloomFilter(8, hashFunctions, dbSaver,nullptr);

TEST(SaveFilterArrayTest, SaveFilterArray) {

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
	bloomFilter = BloomFilter(8, hashFunctions, dbSaver,nullptr);

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

// For empty file
TEST(SaveFilterArrayTest, EmptyFile) {
	std::filesystem::remove("data/array_filter");
	std::ofstream outFile("data/array_filter");
	outFile.close();

	bloomFilter = BloomFilter(8, hashFunctions, dbSaver,nullptr);

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