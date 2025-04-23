#include <gtest/gtest.h>
#include <fstream>
#include <string>
#include <vector>
#include <filesystem>
#include <memory>
#include "../src/DB/FileDB/FileDBLoader.h"

const std::string dataDir = "data";
const std::string blacklistPath = dataDir + "/blacklist";

void writeToBlacklistFile(const std::vector<std::string>& urls) {
    std::ofstream outFile(blacklistPath, std::ios::trunc);
    for (const auto& url : urls) {
        outFile << url << '\n';
    }
    outFile.close();
}

TEST(LoadURLsTest, LoadFromValidFile) {
    std::vector<std::string> sampleURLs = {
        "www.example.com",
        "www.test.com",
        "www.google.com"
    };

    std::filesystem::create_directory(dataDir);
    writeToBlacklistFile(sampleURLs);

    FileDBLoader loader(dataDir, "blacklist", "array_filter");
    std::vector<std::string> loadedURLs;

    loader.loadURLs(loadedURLs);

    ASSERT_EQ(loadedURLs.size(), sampleURLs.size());
    for (size_t i = 0; i < sampleURLs.size(); ++i) {
        EXPECT_EQ(loadedURLs[i], sampleURLs[i]);
    }
}

TEST(LoadURLsTest, EmptyFileLoadsNothing) {
    std::filesystem::create_directory(dataDir);
    std::ofstream(blacklistPath, std::ios::trunc).close();

    FileDBLoader loader(dataDir, "blacklist", "array_filter");
    std::vector<std::string> loadedURLs;

    loader.loadURLs(loadedURLs);

    EXPECT_TRUE(loadedURLs.empty());
}

TEST(LoadURLsTest, FileDoesNotExist) {
    std::filesystem::remove(blacklistPath); // Ensure it doesn't exist

    FileDBLoader loader(dataDir, "blacklist", "array_filter");
    std::vector<std::string> loadedURLs;

    loader.loadURLs(loadedURLs);

    EXPECT_TRUE(loadedURLs.empty());
}
