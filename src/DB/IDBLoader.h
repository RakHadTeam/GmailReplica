#pragma once

#include <vector>

class IDBLoader {
public:
	virtual ~IDBLoader() = default;

	virtual bool loadArrayFilter(std::vector<bool>& bitArray) = 0;
};