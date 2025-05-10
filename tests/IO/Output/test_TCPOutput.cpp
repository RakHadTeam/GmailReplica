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
	char buffer[BUFFER_SIZE] = { 0 };
	ssize_t len = ::recv(fds[1], buffer, BUFFER_SIZE, 0);

    ASSERT_GT(len, 0);
    std::string received(buffer, len);
    EXPECT_NE(received.find("200"), std::string::npos);

    close(fds[0]);
    close(fds[1]);
}

TEST(TCPOutputTest, SendResponse_NotFound) {
    int fds[2];
    createSocketPair(fds);

    TCPOutput output(fds[0]);
    auto response = std::make_shared<Response>(StatusCode::NOT_FOUND);
    output.sendResponse(response);

    char buffer[1024] = {0};
    ssize_t len = ::recv(fds[1], buffer, sizeof(buffer) - 1, 0);

    ASSERT_GT(len, 0);
    std::string received(buffer, len);
    EXPECT_NE(received.find("404"), std::string::npos);

    close(fds[0]);
    close(fds[1]);
}