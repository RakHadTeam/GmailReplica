#include <BloomFilter/BloomFilter.h>
#include <BloomFilter/HashFunction/STDHash/STDHash.h>
#include <gtest/gtest.h>
#include <DB/IDBSaver.h>
#include <DB/IDBLoader.h>
#include <DB/FileDB/FileDBSaver/FileDBSaver.h>
#include <fstream>
#include <filesystem>

std::vector<std::string> readFileLines(const std::string& filePath) {
    std::vector<std::string> lines;
    std::ifstream file(filePath);
    std::string line;
    while (std::getline(file, line)) {
        lines.push_back(line);
    }
    return lines;
}

static std::string dataDir = "data";
static std::string filePath = dataDir + "/blacklist";

TEST(DeleteMethodTest, DeleteSingleURL) {
    std::filesystem::remove(filePath);
    auto dbSaver = std::make_shared<FileDBSaver>(
        dataDir,
        "blacklist",
        "array_filter"
    );

    std::vector<std::shared_ptr<IHashFunction>> hashFunctions;
    hashFunctions.push_back(std::make_shared<STDHash>(1));
    BloomFilter bloomFilter(10, hashFunctions, dbSaver, nullptr);

    std::string url = "example.com";
    bloomFilter.add(url);
    EXPECT_TRUE(bloomFilter.containsInArray(url));
    bloomFilter.remove(url);
    EXPECT_FALSE(bloomFilter.containsInArray(url));

    auto lines = readFileLines(filePath);
    EXPECT_TRUE(lines.empty());
}

TEST(DeleteMethodTest, DeleteNonexistentURL) {
    std::filesystem::remove(filePath);
    auto dbSaver = std::make_shared<FileDBSaver>(
        dataDir,
        "blacklist",
        "array_filter"
    );

    std::vector<std::shared_ptr<IHashFunction>> hashFunctions;
    hashFunctions.push_back(std::make_shared<STDHash>(3));
    BloomFilter bloomFilter(10, hashFunctions, dbSaver, nullptr);

    std::string url = "ghost.com";
    EXPECT_NO_THROW(bloomFilter.remove(url));
    EXPECT_FALSE(bloomFilter.containsInArray(url));

    auto lines = readFileLines(filePath);
    EXPECT_TRUE(lines.empty());
}

TEST(DeleteMethodTest, MultipleRemoveCalls) {
    std::filesystem::remove(filePath);
    auto dbSaver = std::make_shared<FileDBSaver>(
        dataDir,
        "blacklist",
        "array_filter"
    );

    std::vector<std::shared_ptr<IHashFunction>> hashFunctions;
    hashFunctions.push_back(std::make_shared<STDHash>(1));
    BloomFilter bloomFilter(10, hashFunctions, dbSaver, nullptr);

    std::string url = "example.com";
    bloomFilter.add(url);
    bloomFilter.remove(url);
    EXPECT_FALSE(bloomFilter.containsInArray(url));
    bloomFilter.remove(url);
    EXPECT_FALSE(bloomFilter.containsInArray(url));

    auto lines = readFileLines(filePath);
    EXPECT_TRUE(lines.empty());
}

TEST(DeleteMethodTest, DeleteFromBlacklistOnly) {
    std::filesystem::remove(filePath);
    auto dbSaver = std::make_shared<FileDBSaver>(
        dataDir,
        "blacklist",
        "array_filter"
    );

    std::ofstream outFile(filePath);
    outFile << "example.com\nother.com\n";
    outFile.close();

    std::vector<std::shared_ptr<IHashFunction>> hashFunctions;
    hashFunctions.push_back(std::make_shared<STDHash>(1));
    BloomFilter bloomFilter(10, hashFunctions, dbSaver, nullptr);
    bloomFilter.remove("example.com");

    auto lines = readFileLines(filePath);

    std::cout << "Contents of the file after delete operation:" << std::endl;
    for (const auto& line : lines) {
        std::cout << line << std::endl;
    }

    EXPECT_EQ(lines.size(), 1);
    EXPECT_EQ(lines[0], "other.com");
}
