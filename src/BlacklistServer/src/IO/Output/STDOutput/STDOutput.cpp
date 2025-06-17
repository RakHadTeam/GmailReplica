#include <iostream>
#include <sstream>
#include <IO/Output/STDOutput/STDOutput.h>

void STDOutput::sendResponse(std::shared_ptr<Response> res) {
	if (res->getPayload().empty()) {
		return;
	}
	std::cout << res->getPayload() << std::endl;
}
