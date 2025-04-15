#ifndef IHASHFUNCTION_H
#define IHASHFUNCTION_H

#include <string>

class IHashFunction {
public:
	virtual ~IHashFunction() = default;
	virtual size_t hash(const std::string& key) const = 0;
	virtual IHashFunction* clone() const = 0; // Clone method for deep copying
};

#endif // IHASHFUNCTION_H