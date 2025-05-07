#pragma once

#include <IO/Output/IOutput.h>
#include <iostream>
#include <Response/Response.h>

// The STDOutput class implements the IOutput interface to display results to the standard output.
class STDOutput : public IOutput {
public:
	void sendResponse(std::shared_ptr<Response> res);
};