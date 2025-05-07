#include <gtest/gtest.h>
#include <Request/Request.h>

TEST(RequestTest, ParseGetRequest) {
	std::string raw = "GET /search?query=noway&lang=en HTTP/1.1\r\n\r\n";
	Request req(raw);

	EXPECT_EQ(req.getMethod(), "GET");
	auto params = req.getParameters();
	EXPECT_EQ(params["query"], "noway");
	EXPECT_EQ(params["lang"], "en");
}

TEST(RequestTest, ParsePostRequest) {
	std::string raw = "POST /submit HTTP/1.1\r\n\r\nusername=admin&password=admin";
	Request req(raw);

	EXPECT_EQ(req.getMethod(), "POST");
	auto params = req.getParameters();
	EXPECT_EQ(params["username"], "admin");
	EXPECT_EQ(params["password"], "admin");
}

TEST(RequestTest, ParseDeleteRequest) {
	std::string raw = "DELETE /delete HTTP/1.1\r\n\r\nid=20";
	Request req(raw);

	EXPECT_EQ(req.getMethod(), "DELETE");
	auto params = req.getParameters();
	EXPECT_EQ(params["id"], "20");
}

TEST(RequestTest, ConstructRequestFromParams) {
	std::map<std::string, std::string> params = {
		{"shelf", "book"},
		{"qty", "3"}
	};
	Request req("POST", "/item", params);

	EXPECT_EQ(req.getMethod(), "POST");
	auto parsedParams = req.getParameters();
	EXPECT_EQ(parsedParams["shelf"], "book");
	EXPECT_EQ(parsedParams["qty"], "3");
}

TEST(RequestTest, HandleMalformedParams) {
	std::string raw = "GET /search?badparam HTTP/1.1\r\n\r\n";
	Request req(raw);

	auto params = req.getParameters();
	EXPECT_TRUE(params.empty());
	EXPECT_EQ(params.size(), 0);
}