#include <gtest/gtest.h>
#include <TCPServer/TCPServer.h>
#include <thread>
#include <atomic>
#include <chrono>
#include <future>

//------------------------------------------------------------------------------
// Subclass for Testing
//------------------------------------------------------------------------------
class test_StartServer : public TCPServer {
public:
    std::atomic<int> connectionsHandled{0};

protected:
    void handleClient(int clientSock) override {
        connectionsHandled.fetch_add(1, std::memory_order_relaxed);
    }
};

//------------------------------------------------------------------------------
// Helper function to simulate a client connection
//------------------------------------------------------------------------------
static void simulateClientConnection(int port) {
    std::this_thread::sleep_for(std::chrono::milliseconds(50));
    // Logic to simulate a client connection can be placed here
}

//------------------------------------------------------------------------------
// Tests for TCPServer
//------------------------------------------------------------------------------
TEST(TCPServerTest, BindToPortZero_SucceedsAndListens) {
    test_StartServer server;

    // Act
    bool success = server.startServer(0);

    // Assert
    EXPECT_TRUE(success);             // Should successfully bind
    int boundPort = server.getPort(); 
    EXPECT_EQ(boundPort, 0);          // Should be bound to port 0

    // Clean up
    server.shutdown();
}

TEST(TCPServerTest, BindFailure_InvalidPort_ReturnsError) {
    test_StartServer server;

    // Act
    bool success = server.startServer(-1); // Invalid port

    // Assert
    EXPECT_FALSE(success); // Should fail to bind
}

TEST(TCPServerTest, ListenFailure_PortInUse_ReturnsError) {
    test_StartServer s1;

    // Act
    ASSERT_TRUE(s1.startServer(8080)); // Start first server
    int port = s1.getPort();

    test_StartServer s2;
    bool success = s2.startServer(port); // Try to reuse the same port

    // Assert
    EXPECT_FALSE(success); // Should fail because the port is in use

    // Clean up
    s1.shutdown();
}

TEST(TCPServerTest, AcceptClient_HandlesIncomingConnection) {
    test_StartServer server;

    // Act
    ASSERT_TRUE(server.startServer(0));
    int port = server.getPort();

    // Launch a simulated client asynchronously
    auto future = std::async(std::launch::async, simulateClientConnection, port);

    // Give time for the client to connect
    std::this_thread::sleep_for(std::chrono::milliseconds(100));

    // Assert
    EXPECT_GE(server.connectionsHandled.load(), 1); // At least one connection handled

    // Clean up
    server.shutdown();
}

TEST(TCPServerTest, CleanShutdown_DoesNotHang) {
    test_StartServer server;

    // Act
    ASSERT_TRUE(server.startServer(0));

    // Assert
    EXPECT_NO_THROW(server.shutdown()); // Shutdown should not throw exceptions
}
