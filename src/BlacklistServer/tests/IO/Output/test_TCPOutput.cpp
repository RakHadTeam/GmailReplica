#include <gtest/gtest.h>
#include <IO/Output/TCPOutput/TCPOutput.h>
#include <Response/Response.h>
#include <TCPServer/TCPServer.h>
#include <TCPServer/StatusCode.h>
#include <sys/socket.h>
#include <unistd.h>
#include <string>
#include <cstring>

// Helper function to create a pair of connected sockets
void createSocketPair(int fds[2]) {
    if (socketpair(AF_UNIX, SOCK_STREAM, 0, fds) < 0) {
        perror("socketpair");
        exit(1);
    }
}

TEST(TCPOutputTest, SendResponse_OK) {
    int fds[2];
    createSocketPair(fds);

    // Create a TCPOutput with one end of the socket pair
    TCPOutput output(fds[0]);

    // Create a response object
    auto response = std::make_shared<Response>(StatusCode::OK);

    // Send the response
    output.sendResponse(response);

    // Read the response from the other end
	std::string buffer;
	char tmp[BUFFER_SIZE];
	while (true) {
		ssize_t bytesRead = read(fds[1], tmp, BUFFER_SIZE);
		if (bytesRead <= 0) break;
		buffer.append(tmp, bytesRead);
		if (!buffer.empty() && buffer.back() == '\n') break; // Stop when newline is the last character
	}

    ASSERT_GT(buffer.size(), 0);
    EXPECT_NE(buffer.find("200"), std::string::npos);

    close(fds[0]);
    close(fds[1]);
}

TEST(TCPOutputTest, SendResponse_NotFound) {
    int fds[2];
    createSocketPair(fds);

    TCPOutput output(fds[0]);
    auto response = std::make_shared<Response>(StatusCode::NOT_FOUND);
    output.sendResponse(response);

	std::string buffer;
	char tmp[BUFFER_SIZE];
	while (true) {
		ssize_t bytesRead = read(fds[1], tmp, BUFFER_SIZE);
		if (bytesRead <= 0) break;
		buffer.append(tmp, bytesRead);
		if (!buffer.empty() && buffer.back() == '\n') break; // Stop when newline is the last character
	}
    ASSERT_GT(buffer.size(), 0);
    EXPECT_NE(buffer.find("404"), std::string::npos);
	ASSERT_EQ("404 Not Found\n", buffer);

    close(fds[0]);
    close(fds[1]);
}

TEST(TCPOutputTest, SendResponse_BadRequest) {
	int fds[2];
	createSocketPair(fds);

	TCPOutput output(fds[0]);
	auto response = std::make_shared<Response>(StatusCode::BAD_REQUEST);
	output.sendResponse(response);

	std::string buffer;
	char tmp[BUFFER_SIZE];
	while (true) {
		ssize_t bytesRead = read(fds[1], tmp, BUFFER_SIZE);
		if (bytesRead <= 0) break;
		buffer.append(tmp, bytesRead);
		if (!buffer.empty() && buffer.back() == '\n') break; // Stop when newline is the last character
	}
	ASSERT_GT(buffer.size(), 0);
	EXPECT_NE(buffer.find("400"), std::string::npos);
	ASSERT_EQ("400 Bad Request\n", buffer);

	close(fds[0]);
	close(fds[1]);
}

// Send a response with a payload

TEST(TCPOutputTest, SendResponse_WithPayload) {
	int fds[2];
	createSocketPair(fds);

	TCPOutput output(fds[0]);
	auto response = std::make_shared<Response>(StatusCode::OK, "This is a test payload.");
	output.sendResponse(response);

	std::string buffer;
	char tmp[BUFFER_SIZE];
	while (true) {
		ssize_t bytesRead = read(fds[1], tmp, BUFFER_SIZE);
		if (bytesRead <= 0) break;
		buffer.append(tmp, bytesRead);
		if (!buffer.empty() && buffer.back() == '\n') break; // Stop when newline is the last character
	}
	ASSERT_GT(buffer.size(), 0);
	EXPECT_NE(buffer.find("200"), std::string::npos);
	EXPECT_NE(buffer.find("This is a test payload."), std::string::npos);
	ASSERT_EQ("200 OK\n\nThis is a test payload.\n", buffer);

	close(fds[0]);
	close(fds[1]);
}