#include <vector>
#include <iostream>
#include <sstream>
#include <string>

#include "STDHash.h"
#include "Input.h"

class STDINInput : public Input {
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
	void getHashFunctions(std::vector<IHashFunction*>& hashFunctions) {
		std::istringstream iss(firstLine);
		int token;

		iss >> token; // Read the first token (size of bitArray)
		while (iss >> token) {
			hashFunctions.push_back(new STDHash(token));
		}
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

	// Get a URL from user input
	void getURL(std::string& url) {
		std::string line;
		std::getline(std::cin, line);

		std::istringstream iss(line);
		iss >> url;

		if (iss >> url) {
			url.clear();
		}
	}
};
