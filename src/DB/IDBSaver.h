#pragma once

#include <vector>

class IDBSaver {
public:
	virtual ~IDBSaver() = default;

	virtual void saveFilterArray(std::vector<bool>& bitArray) = 0;
};