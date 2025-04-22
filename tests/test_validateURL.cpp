#include <gtest/gtest.h>
#include "../src/IO/Input/STDInput.h"
#include "../src/Validators/URLValidator.h"

TEST(ValidateURLTest, ValidURLs) {
    STDInput input;

    std::string url1 = "www.example.com";
    std::string url2 = "sub.domain.net";
    std::string url3 = "a.b.c"; // Also valid (2 dots)

    EXPECT_TRUE(URLValidator::isValid(url1));
    EXPECT_TRUE(URLValidator::isValid(url2));
    EXPECT_TRUE(URLValidator::isValid(url3));
}

TEST(ValidateURLTest, InvalidURLs) {
    STDInput input;

    std::string url1 = "example";       // No dots
    std::string url2 = "site.com";      // Only 1 dot
    std::string url3 = "....";          // Too weird
    std::string url4 = "http://a.b";    // Only 1 valid dot section
    std::string url5 = "a.b ";          // Whitespace
    std::string url6 = "a b c";         // Whitespace again

    EXPECT_FALSE(URLValidator::isValid(url1));
    EXPECT_FALSE(URLValidator::isValid(url2));
    EXPECT_FALSE(URLValidator::isValid(url3));
    EXPECT_FALSE(URLValidator::isValid(url4));
    EXPECT_FALSE(URLValidator::isValid(url5));
    EXPECT_FALSE(URLValidator::isValid(url6));
}
