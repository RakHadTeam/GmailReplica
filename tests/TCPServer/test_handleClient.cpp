#include <gtest/gtest.h>
#include <TCPServer/TCPServer.h>
#include <sys/socket.h>
#include <unistd.h>
#include <errno.h>
#include <string>

class HttpTestServer : public TCPServer {
public:
    using TCPServer::handleClient;
};

static std::string readAll(int fd) {
    std::string out;
    char buf[1024];
    ssize_t n;
    while ((n = ::read(fd, buf, sizeof(buf))) > 0) {
        out.append(buf, n);
    }
    return out;
}

TEST(TCPServerTest, HandleClient_ValidPingReturns200AndPong) {
    int sv[2];
    ASSERT_EQ(0, socketpair(AF_UNIX, SOCK_STREAM, 0, sv));
    HttpTestServer server;
    const char req[] = "GET /ping HTTP/1.1\r\nHost: localhost\r\n\r\n";
    ASSERT_EQ(ssize_t(sizeof(req)-1), ::write(sv[0], req, sizeof(req)-1));
    ::shutdown(sv[0], SHUT_WR);
    server.handleClient(sv[1]);
    std::string resp = readAll(sv[0]);
    EXPECT_NE(resp.find("200"), std::string::npos);
    EXPECT_NE(resp.find("PONG"), std::string::npos);
}

TEST(TCPServerTest, HandleClient_MalformedInputReturns404) {
    int sv[2];
    ASSERT_EQ(0, socketpair(AF_UNIX, SOCK_STREAM, 0, sv));
    HttpTestServer server;
    const char bad[] = "INVALID REQUEST";
    ASSERT_EQ(ssize_t(sizeof(bad)-1), ::write(sv[0], bad, sizeof(bad)-1));
    ::shutdown(sv[0], SHUT_WR);
    EXPECT_NO_THROW(server.handleClient(sv[1]));
    std::string resp = readAll(sv[0]);
    EXPECT_NE(resp.find("404"), std::string::npos);
}

TEST(TCPServerTest, HandleClient_ClosesSocketAfterReturn) {
    int sv[2];
    ASSERT_EQ(0, socketpair(AF_UNIX, SOCK_STREAM, 0, sv));
    HttpTestServer server;
    const char req[] = "GET /ping HTTP/1.1\r\nHost: localhost\r\n\r\n";
    ASSERT_EQ(ssize_t(sizeof(req)-1), ::write(sv[0], req, sizeof(req)-1));
    ::shutdown(sv[0], SHUT_WR);
    server.handleClient(sv[1]);
    errno = 0;
    EXPECT_EQ(-1, ::write(sv[1], "x", 1));
    EXPECT_EQ(EBADF, errno);
}
