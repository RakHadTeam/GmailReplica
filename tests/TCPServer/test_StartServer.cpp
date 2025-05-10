#include <gtest/gtest.h>
#include <TCPServer/TCPServer.h>
#include <thread>
#include <atomic>
#include <chrono>
#include <future>


#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>

std::map<std::string, std::shared_ptr<ICommand>> commands;

class TestServer : public TCPServer {
public:
	std::atomic<int> connectionsHandled{ 0 };
	TestServer(std::map<std::string, std::shared_ptr<ICommand>>& commands)
		: TCPServer(commands) {
	}
protected:
	void handleClient(int clientSock) override {
		connectionsHandled.fetch_add(1, std::memory_order_relaxed);
		::close(clientSock);
	}
};


static void simulateClientConnection(int port) {
	std::this_thread::sleep_for(std::chrono::milliseconds(50));
	int sock = ::socket(AF_INET, SOCK_STREAM, 0);
	if (sock < 0) return;

	sockaddr_in addr{};
	addr.sin_family = AF_INET;
	addr.sin_port = htons(port);
	inet_pton(AF_INET, "127.0.0.1", &addr.sin_addr);

	if (::connect(sock, reinterpret_cast<sockaddr*>(&addr), sizeof(addr)) < 0) {
		::close(sock);
		return;
	}
	// immediately close
	::close(sock);
}

TEST(TCPServerTest, BindToPortZero_SucceedsAndListens) {
	TestServer server(commands);

	bool success = server.startServer(0);
	EXPECT_TRUE(success);

	int boundPort = server.getPort();
	EXPECT_GT(boundPort, 0) << "Port 0 should yield an ephemeral port > 0";

	server.shutdown();
}

TEST(TCPServerTest, BindFailure_InvalidPort_ReturnsError) {
	TestServer server(commands);
	EXPECT_FALSE(server.startServer(-1));
	EXPECT_FALSE(server.startServer(70000));
}

TEST(TCPServerTest, ListenFailure_PortInUse_ReturnsError) {
	TestServer s1(commands);
	ASSERT_TRUE(s1.startServer(8080));
	int port = s1.getPort();

	TestServer s2(commands);
	EXPECT_FALSE(s2.startServer(port));

	s1.shutdown();
}

TEST(TCPServerTest, AcceptClient_HandlesIncomingConnection) {
	TestServer server(commands);
	ASSERT_TRUE(server.startServer(0));
	int port = server.getPort();

	auto fut = std::async(std::launch::async, simulateClientConnection, port);

	std::this_thread::sleep_for(std::chrono::milliseconds(200));

	EXPECT_GE(server.connectionsHandled.load(), 1);

	server.shutdown();
}

TEST(TCPServerTest, CleanShutdown_DoesNotHang) {
	TestServer server(commands);
	ASSERT_TRUE(server.startServer(0));
	EXPECT_NO_THROW(server.shutdown());
}
