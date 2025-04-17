#ifndef IINPUT_H
#define IINPUT_H

#include <vector>
class IInput {
public:
	virtual void getHashFunctions(std::vector<IHashFunction*>& hashFunctions) = 0;
	virtual void getURL(std::string& url) = 0;
	virtual int getSizeOfArray() = 0;
};

#endif // IINPUT_H
