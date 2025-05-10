// #include <gtest/gtest.h>
// #include <TCPServer/TCPServer.h>
// #include <sys/socket.h>
// #include <unistd.h>
// #include <errno.h>
// #include <string>

// class PlainTextTestServer : public TCPServer {
// public:
//     using TCPServer::handleClient;
// };

// static std::string readAll(int fd) {
//     std::string out;
//     char buf[1024];
//     ssize_t n;
//     while ((n = ::read(fd, buf, sizeof(buf))) > 0) {
//         out.append(buf, n);
//     }
//     return out;
// }

// TEST(TCPServerTest, HandleClient_ValidPingReturnsPong) {
//     int sv[2];
//     ASSERT_EQ(0, socketpair(AF_UNIX, SOCK_STREAM, 0, sv));

//     PlainTextTestServer server;
//     // Client sends "PING\n"
//     const char req[] = "PING\n";
//     ASSERT_EQ(ssize_t(sizeof(req) - 1), ::write(sv[0], req, sizeof(req) - 1));
//     ::shutdown(sv[0], SHUT_WR);

//     server.handleClient(sv[1]);

//     std::string resp = readAll(sv[0]);
//     // Expect exactly "PONG\n"
//     EXPECT_EQ("PONG\n", resp);
// }

// TEST(TCPServerTest, HandleClient_MalformedInputReturnsError) {
//     int sv[2];
//     ASSERT_EQ(0, socketpair(AF_UNIX, SOCK_STREAM, 0, sv));

//     PlainTextTestServer server;
//     // Send something the server doesn't understand
//     const char bad[] = "HELLO\n";
//     ASSERT_EQ(ssize_t(sizeof(bad) - 1), ::write(sv[0], bad, sizeof(bad) - 1));
//     ::shutdown(sv[0], SHUT_WR);

//     EXPECT_NO_THROW(server.handleClient(sv[1]));

//     std::string resp = readAll(sv[0]);
//     // Expect an "ERROR" response
//     EXPECT_EQ("ERROR\n", resp);
// }

// TEST(TCPServerTest, HandleClient_ClosesSocketAfterReturn) {
//     int sv[2];
//     ASSERT_EQ(0, socketpair(AF_UNIX, SOCK_STREAM, 0, sv));

//     PlainTextTestServer server;
//     const char req[] = "PING\n";
//     ASSERT_EQ(ssize_t(sizeof(req) - 1), ::write(sv[0], req, sizeof(req) - 1));
//     ::shutdown(sv[0], SHUT_WR);

//     server.handleClient(sv[1]);

//     // After handleClient returns, sv[1] should be closed
//     errno = 0;
//     EXPECT_EQ(-1, ::write(sv[1], "x", 1));
//     EXPECT_EQ(EBADF, errno);
// }
