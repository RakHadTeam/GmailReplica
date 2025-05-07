#include <gtest/gtest.h>
#include <Response/Response.h>
#include <TCPServer/StatusCode.h>

TEST(ResponseTest, ConstructorWithOnlyStatus) {
	Response res(StatusCode::NO_CONTENT);
	EXPECT_EQ(res.getStatus(), StatusCode::NO_CONTENT);
}

TEST(ResponseTest, GetRawDataReturnsCorrectFormat_OK) {
	Response res(StatusCode::OK);
	std::string expected = "HTTP/1.1 200 OK\n";
	EXPECT_EQ(res.getRawData(), expected);
}

TEST(ResponseTest, GetRawDataReturnsCorrectFormat_Created) {
	Response res(StatusCode::CREATED);
	std::string expected = "HTTP/1.1 201 Created\n";
	EXPECT_EQ(res.getRawData(), expected);
}

TEST(ResponseTest, GetRawDataReturnsCorrectFormat_NotFound) {
	Response res(StatusCode::NOT_FOUND);
	std::string expected = "HTTP/1.1 404 Not Found\n";
	EXPECT_EQ(res.getRawData(), expected);
}

TEST(ResponseTest, GetRawDataReturnsCorrectFormat_Accepted) {
	Response res(StatusCode::ACCEPTED);
	std::string expected = "HTTP/1.1 202 Accepted\n";
	EXPECT_EQ(res.getRawData(), expected);
}

TEST(ResponseTest, GetRawDataReturnsCorrectFormat_BadRequest) {
	Response res(StatusCode::BAD_REQUEST);
	std::string expected = "HTTP/1.1 400 Bad Request\n";
	EXPECT_EQ(res.getRawData(), expected);
}