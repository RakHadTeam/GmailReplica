#include <vector>
#include <iostream>
#include <sstream>
#include <string>
#include <regex>

#include "STDHash.cpp"
#include "IInput.h"

class STDInput : public IInput {
private:
	std::string firstLine;

	// Check if a given string represents a positive integer
	bool isPositiveInteger(const std::string& str) {
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

	// Clear and delete hash functions
	void clearHashFunctions(std::vector<IHashFunction*>& hashFunctions) {
		for (auto* func : hashFunctions) {
			delete func;
		}
		hashFunctions.clear();
	}

	// Validate if the input stream contains only positive integers
	bool isValidInputStream() {
		std::istringstream iss(firstLine);
		std::string token;

		while (iss >> token) {
			if (!isPositiveInteger(token)) {
				return false;
			}
		}
		return true;
	}

public:
	// Read and validate a list of positive integers from the user
	void setHashFunctions(std::vector<std::shared_ptr<IHashFunction>>& hashFunctions) {
		std::istringstream iss(firstLine);
		int token;

		iss >> token; // Read the first token (size of bitArray)
		while (iss >> token) {
			hashFunctions.push_back(std::make_shared<STDHash>(token));
		}

		firstLine.clear(); 
	}

	// Get the size of the array from user input
	int getSizeOfArray() {
		std::getline(std::cin, firstLine);

		if (!isValidInputStream()) {
			return getSizeOfArray(); // Recursively prompt for valid input
		}

		std::istringstream iss(firstLine);
		int size;
		iss >> size;
		return size;
	}

	bool validateURL(const std::string& url) {
		const std::regex urlRegex(R"(^\S*\.\S*\.\S*$)");
		return std::regex_match(url, urlRegex);
	}

	// Get a URL from user input
	std::string getURL() {
		std::string URL;
		std::string line;
		std::getline(std::cin, line);

		std::istringstream iss(line);
		iss >> URL;

		// If there are more arguments, clear the URL
		if (iss >> URL  || !validateURL(URL)) {
			URL.clear();
		}
		return URL;
	}

	std::string getCommandPrefix() {
		std::string commandPrefix;
		std::cin >> commandPrefix;

		return commandPrefix;
	}
};
