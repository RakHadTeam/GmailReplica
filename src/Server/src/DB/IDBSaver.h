#pragma once

#include <vector>
#include <string>

class IDBSaver {
public:
	virtual ~IDBSaver() = default;

	virtual void saveFilterArray(std::vector<bool>& bitArray) = 0;

	virtual void saveURL(const std::string& url) = 0;

	virtual void deleteURL(const std::string& url) = 0;
};