#include <gtest/gtest.h>
#include <IO/Input/STDInput/STDInput.h>
#include <Validators/URLValidator/URLValidator.h>

TEST(ValidateURLTest, ValidURLs) {
    STDInput input;

    std::string url1 = "www.example.com";
    std::string url2 = "sub.domain.net";
    std::string url3 = "a.b.c";
	std::string url4 = "http://example.com";
	std::string url5 = "https://example.com";
	std::string url6 = "ftp://example.com";

    EXPECT_TRUE(URLValidator::isValid(url1));
    EXPECT_TRUE(URLValidator::isValid(url2));
    EXPECT_TRUE(URLValidator::isValid(url3));
    EXPECT_TRUE(URLValidator::isValid(url4));
    EXPECT_TRUE(URLValidator::isValid(url5));
    EXPECT_TRUE(URLValidator::isValid(url6));
}

TEST(ValidateURLTest, InvalidURLs) {
    STDInput input;

    std::string url1 = "example";       // No dots
    std::string url3 = "....";          // Too weird
    std::string url5 = "a.b ";          // Whitespace
    std::string url6 = "a b c";         // Whitespace again
	std::string url7 = "http://example.com.fse.fsef"; // Not valid
	std::string url8 = "http://example.com/"; // Trailing slash
	// more invalid URLs
	std::string url9 = "http://example.com/a/b/c"; // Too many segments
	std::string url10 = "http://example.com/."; // Single dot
	std::string url11 = "http://example.com/.."; // Double dot
	std::string url2 = "http://example.com:8080"; // Port number
	std::string url4 = "http://example.com:8080/"; // Port number with trailing slash

    EXPECT_FALSE(URLValidator::isValid(url1));
    EXPECT_FALSE(URLValidator::isValid(url3));
    EXPECT_FALSE(URLValidator::isValid(url5));
    EXPECT_FALSE(URLValidator::isValid(url6));
	EXPECT_FALSE(URLValidator::isValid(url7));
	EXPECT_FALSE(URLValidator::isValid(url8));
	EXPECT_FALSE(URLValidator::isValid(url9));
	EXPECT_FALSE(URLValidator::isValid(url10));
	EXPECT_FALSE(URLValidator::isValid(url11));
	EXPECT_FALSE(URLValidator::isValid(url2));
	EXPECT_FALSE(URLValidator::isValid(url4));
}
