#ifndef IOUTPUT_H
#define IOUTPUT_H
#include <vector>
#include <string>

class IOutput {
public:
	virtual ~IOutput() = default;

	// Print a standard message (e.g., feedback to user)
	virtual void printMessage(const std::string& message) = 0;

	// Optionally print specific result types (true/false variants)
	virtual void printCheckURLResult(bool inFilter, bool inRealList) = 0;

	// Save bit array to a file (used by BloomFilter)
	virtual void saveToFile(const std::vector<bool>& bitArray, const std::string& filename) = 0;

	// Load bit array from a file
	virtual void loadFromFile(std::vector<bool>& bitArray, const std::string& filename) = 0;
};

#endif // IOUTPUT_H
