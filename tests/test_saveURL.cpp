#include <gtest/gtest.h>
#include <fstream>
#include <vector>
#include <string>
#include <memory>
#include <filesystem>
#include <../src/DB/FileDB/FileDBSaver.h>
#include <../src/DB/IDBSaver.h>

std::string dataDir = "data";
std::string filePath = dataDir + "/blacklist";

TEST(SaveURLTest, SaveSingleURL) {
	std::filesystem::remove(filePath);
	auto dbSaver = std::make_shared<FileDBSaver>(dataDir);
	std::string url = "www.example.com";

	dbSaver->saveURL(url);

	std::ifstream inFile(filePath);
	ASSERT_TRUE(inFile.is_open());

	std::string line;
	std::getline(inFile, line);
	EXPECT_EQ(line, url);

	inFile.close();
}

TEST(SaveURLTest, SaveMultipleURLs) {
	std::filesystem::remove(filePath);
	auto dbSaver = std::make_shared<FileDBSaver>(dataDir);
	std::vector<std::string> urls = { "www.example.com", "www.test.com", "www.google.com" };

	for (const auto& url : urls) {
		dbSaver->saveURL(url);
	}

	std::ifstream inFile(filePath);
	ASSERT_TRUE(inFile.is_open());

	std::string line;
	for (const auto& expected : urls) {
		std::getline(inFile, line);
		EXPECT_EQ(line, expected);
	}

	inFile.close();
}

TEST(SaveURLTest, FileCreatedIfNotExists) {
	std::filesystem::remove(filePath);
	EXPECT_FALSE(std::filesystem::exists(filePath));

	auto dbSaver = std::make_shared<FileDBSaver>(dataDir);
	dbSaver->saveURL("www.created.com");

	EXPECT_TRUE(std::filesystem::exists(filePath));

	std::ifstream inFile(filePath);
	std::string line;
	std::getline(inFile, line);
	EXPECT_EQ(line, "www.created.com");

	inFile.close();
}
