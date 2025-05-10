#include <gtest/gtest.h>
#include <IO/Input/TCPInput/TCPInput.h>
#include <Request/Request.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>

TEST(TCPInputTest, ReceivesValidRequest) {
    int sv[2];
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sv), 0);

    std::string rawRequest = "POST http://example.com\n";
	// send in 4096 bytes
	::send(sv[1], rawRequest.c_str(), BUFFER_SIZE, 0);

	// Sleep for a second to ensure the request is processed
	sleep(1);

	TCPInput input(sv[0]);
	std::shared_ptr<Request> req = input.getRequest();

	ASSERT_NE(req, nullptr);
	EXPECT_EQ(req->getMethod(), "POST");
	EXPECT_EQ(req->getParameter("url"), "http://example.com");

    close(sv[0]);
    close(sv[1]);
}

TEST(TCPInputTest, HandlesMissingMethod) {
    int sv[2];
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sv), 0);

    ::send(sv[1], "1", 1, 0);

    TCPInput input(sv[0]);
    std::shared_ptr<Request> req = input.getRequest();

    EXPECT_EQ(req->getMethod(), "");

    close(sv[0]);
    close(sv[1]);
}
