#include "FileDBLoader.h"
#include <iostream>
#include <fstream>

FileDBLoader::FileDBLoader(const std::string& dataFolderPath)
	: dataFolderPath(dataFolderPath) {
}

bool FileDBLoader::loadArrayFilter(std::vector<bool>& bitArray) {
	std::ifstream inFile(dataFolderPath + "/" + dataFileName);

	if (!inFile.is_open()) {
		return false;
	}

	std::vector<bool> tempArray; // temporary copy

	char bit;
	while (inFile >> bit) {
		if (bit == '0') tempArray.push_back(false);
		else if (bit == '1') tempArray.push_back(true);
		else {
			return false; // leave bitArray unchanged
		}
	}

	if (tempArray.size() != bitArray.size()) {
		return false; // leave bitArray unchanged
	}

	// if all good
	bitArray = tempArray;
	return true;
}
