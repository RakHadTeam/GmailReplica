#include <vector>
#include <memory>
#include <iostream>
#include <sstream>
#include <string>
#include <regex>

#include "../../BloomFilter/HashFunction/STDHash.h"
#include "IInput.h"
#include "../../Validators/URLValidator.h"
#include "STDInput.h"

bool STDInput::isPositiveInteger(const std::string& str) {
	if (str.empty()) {
		return false;
	}
	for (char c : str) {
		if (!std::isdigit(c)) {
			return false;
		}
	}
	return std::stoll(str) > 0;
}

bool STDInput::isValidInputStream() {
	std::istringstream iss(firstLine);
	std::string token;

	while (iss >> token) {
		if (!isPositiveInteger(token)) {
			return false;
		}
	}
	return true;
}

void STDInput::setHashFunctions(std::vector<std::shared_ptr<IHashFunction>>& hashFunctions) {
	std::istringstream iss(firstLine);
	int token;

	iss >> token; // Read the first token (size of bitArray)
	while (iss >> token) {
		hashFunctions.push_back(std::make_shared<STDHash>(token));
	}

	firstLine.clear();
}

int STDInput::getSizeOfArray() {
	std::getline(std::cin, firstLine);

	if (!isValidInputStream()) {
		return getSizeOfArray(); // Recursively prompt for valid input
	}

	std::istringstream iss(firstLine);
	int size;
	iss >> size;
	return size;
}

std::string STDInput::getURL() {
	std::string URL;
	std::string line;
	std::getline(std::cin, line);

	std::istringstream iss(line);
	iss >> URL;

	// If there are more arguments, clear the URL
	if (iss >> URL || !URLValidator::isValid(URL)) {
		URL.clear();
	}
	return URL;
}

std::string STDInput::getCommandPrefix() {
	std::string commandPrefix;
	std::cin >> commandPrefix;

	return commandPrefix;
}
