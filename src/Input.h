#ifndef INPUT_H
#define INPUT_H

#include <vector>
class Input {
public:
	Input() = default;
	~Input() = default;

	virtual void getHashFunctions(std::vector<IHashFunction*>& hashFunctions) = 0;
	virtual void getURL(std::string& url) = 0;
	virtual int getSizeOfArray() = 0;
};

#endif // INPUT_H
