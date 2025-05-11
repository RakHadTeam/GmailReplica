#pragma once

#include <vector>
#include <memory>
#include <string>
#include <IO/Input/IInput.h>
#include <BloomFilter/HashFunction/STDHash/STDHash.h>
#include <Validators/URLValidator/URLValidator.h>
#include <vector>
#include <memory>
#include <iostream>
#include <sstream>
#include <string>
#include <regex>

#include <BloomFilter/HashFunction/STDHash/STDHash.h>
#include <IO/Input/IInput.h>
#include <Validators/URLValidator/URLValidator.h>

class STDInput : public IInput {
public:
	// Get a request from the user
	std::shared_ptr<Request> getRequest() override;
};