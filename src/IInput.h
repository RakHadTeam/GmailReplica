#ifndef IINPUT_H
#define IINPUT_H

#include <vector>
class IInput {
public:
	virtual void setHashFunctions(std::vector<std::shared_ptr<IHashFunction>>& hashFunctions) = 0;
	virtual std::string getURL() = 0;
	virtual int getSizeOfArray() = 0;
	virtual std::string getCommandPrefix() = 0;
};

#endif // IINPUT_H
