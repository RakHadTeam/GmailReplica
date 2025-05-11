#include <IO/Input/InitInput/STDInitInput/STDInitInput.h>

bool STDInitInput::isPositiveInteger(const std::string& str) {
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

bool STDInitInput::isValidInputStream() {
	std::istringstream iss(firstLine);
	std::string token;

	while (iss >> token) {
		if (!isPositiveInteger(token)) {
			return false;
		}
	}
	return true;
}

void STDInitInput::setHashFunctions(std::vector<std::shared_ptr<IHashFunction>>& hashFunctions) {
	std::istringstream iss(firstLine);
	int token;

	iss >> token; // Read the first token (size of bitArray)
	while (iss >> token) {
		hashFunctions.push_back(std::make_shared<STDHash>(token));
	}

	firstLine.clear();
}

int STDInitInput::getSizeOfArray() {
	std::getline(std::cin, firstLine);

	if (!isValidInputStream()) {
		return getSizeOfArray(); // Recursively prompt for valid input
	}

	std::istringstream iss(firstLine);
	int size;
	iss >> size;
	return size;
}
