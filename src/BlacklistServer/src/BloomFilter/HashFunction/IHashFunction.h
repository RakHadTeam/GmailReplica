#pragma once

#include <string>

class IHashFunction {
public:
	virtual ~IHashFunction() = default;
	virtual size_t hash(const std::string& key) const = 0;
};