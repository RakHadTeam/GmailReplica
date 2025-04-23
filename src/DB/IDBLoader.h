#pragma once

#include <vector>
#include <string>

class IDBLoader {
public:
	virtual ~IDBLoader() = default;

	virtual bool loadArrayFilter(std::vector<bool>& bitArray) = 0;

	virtual void loadURLs(std::vector<std::string>& URLarray) = 0;
};