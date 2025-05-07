#include <vector>
#include <string>

class TCPServer {
private:
	int serverSocket;
	std::vector<int> clientSockets;
	std::string serverAddress;
	int port;


public:

	void startServer(int port) {
		// Implementation for starting the TCP server
		// This will include creating a socket, binding it to the port,
		// and listening for incoming connections.

		// loop for accepting clients


	}	

	void acceptClient() {
		// Implementation for accepting a client connection
		// This will include accepting a connection and adding the client socket to the clientSockets vector.

		// and creating a new thread to handle the client

	}

	void handleClient(int clientSocket) {
		// Implementation for handling client requests
		// This will include reading data from the client, processing it, and sending a response back.

		// app.run();
	}

	void stopServer() {
		// Implementation for stopping the server
	}





};