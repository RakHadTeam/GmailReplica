#pragma once

#include <vector>
#include <memory>
#include <BloomFilter/HashFunction/IHashFunction.h>
#include <Request/Request.h>
#include <string>

class IInput {
public:
	virtual std::shared_ptr<Request> getRequest() = 0;
	~IInput() = default;
};