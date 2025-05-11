#include <DB/FileDB/FileDBLoader/FileDBLoader.h>
#include <fstream>
#include <iostream>

FileDBLoader::FileDBLoader(const std::string& dataFolderPath,
	const std::string& blacklistFileName,
	const std::string& arrayFileName)
	: dataFolderPath(dataFolderPath),
	blacklistFileName(blacklistFileName),
	arrayFileName(arrayFileName) {
}

void FileDBLoader::loadURLs(std::vector<std::string>& URLarray) {
	std::ifstream inFile(dataFolderPath + "/" + blacklistFileName);

	if (!inFile.is_open()) {
		std::cerr << "Error: Could not open file: " << blacklistFileName << std::endl;
		return;
	}

	std::string line;
	while (std::getline(inFile, line)) {
		if (!line.empty() && line.back() == '\r') {
			line.pop_back(); // Remove Windows-style carriage return if present
		}
		if (!line.empty()) {
			URLarray.push_back(line);
		}
	}
	inFile.close();
}

bool FileDBLoader::loadArrayFilter(std::vector<bool>& bitArray) {
	std::ifstream inFile(dataFolderPath + "/" + arrayFileName);

	if (!inFile.is_open()) {
		std::cerr << "Error: Could not open file: " << arrayFileName << std::endl;
		return false;
	}

	std::vector<bool> tempArray;
	char bit;

	while (inFile >> bit) {
		if (bit == '0') {
			tempArray.push_back(false);
		}
		else if (bit == '1') {
			tempArray.push_back(true);
		}
		else {
			std::cerr << "Error: Invalid bit value found in file: " << arrayFileName << std::endl;
			inFile.close();
			return false;
		}
	}

	if (tempArray.size() != bitArray.size()) {
		std::cerr << "Error: Bit array size mismatch during load." << std::endl;
		inFile.close();
		return false;
	}

	bitArray = std::move(tempArray);
	inFile.close();
	return true;
}
