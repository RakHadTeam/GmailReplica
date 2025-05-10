#include <IO/Output/IOutput.h>
#include <Response/Response.h>
#include <string>
#include <TCPServer/TCPServer.h>
#include <memory>

class TCPOutput : public IOutput {
private:
	int clientSocket; // Socket file descriptor
public:
	// Constructor
	TCPOutput(int clientSocket);
	// Send a response to the user
	void sendResponse(std::shared_ptr<Response> res) override;
};