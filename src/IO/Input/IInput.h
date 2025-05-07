#pragma once

#include <vector>
#include <memory>
#include <BloomFilter/HashFunction/IHashFunction.h>
#include <Request/Request.h>
#include <string>

class IInput {
public:
	virtual void setHashFunctions(std::vector<std::shared_ptr<IHashFunction>>& hashFunctions) = 0;
	virtual int getSizeOfArray() = 0;
	virtual std::shared_ptr<Request> getRequest() = 0;
	~IInput() = default;
};